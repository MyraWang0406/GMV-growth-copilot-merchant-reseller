# 修复总结：merchant/taoke dashboard timeout/504/无限 loading

## 根因分析

### 1. 为什么会 timeout/504？
- **后端查询慢**：`items_top` 和 `items_opportunity` 查询涉及复杂 JOIN，在数据量大时可能超过 8s/30s
- **前端超时设置过短**：之前前端 timeout 只有 8s，后端查询可能超过这个时间
- **没有性能日志**：无法定位哪个阶段慢

### 2. 为什么会 NoneType？
- **fetchone() 返回 None 时直接 [0]**：某些查询可能返回空结果，代码直接访问 `fetchone()[0]` 导致 `TypeError: 'NoneType' object is not subscriptable`
- **缺少判空保护**：没有检查 `row` 是否为 None 或长度是否足够

### 3. 为什么会 duckdb pending result？
- **连接复用问题**：虽然每个函数都创建新连接，但在并发请求时，如果某个连接出错后没有正确关闭，可能导致后续查询报 "Attempting to execute an unsuccessful or closed pending query result"
- **已修复**：每个函数都使用 `try/finally` 确保连接关闭，且每个请求独立连接

## 修改文件列表

### 后端修复
1. **app/api/main.py**
   - 添加 `merchant.router` 到 FastAPI app
   - 确保 `/merchant/*` 路由可用

2. **app/api/merchant.py**
   - 添加 `time` 和 `logging` 导入
   - 修复所有 `fetchone()[0]` 的判空问题（9 处）
   - 修复 `_tables()` 函数，安全处理空结果
   - 重写 `dashboard()` 函数：
     - 添加 `include_items` 参数（默认 0，不查询慢的 items）
     - 添加性能日志（每个 stage 的 duration_ms）
     - 添加 trace_id 用于追踪
     - 错误处理：部分失败时返回 degraded=true，但 HTTP 200
     - 确保每个 stage 独立 try/except，不会因一个失败导致整体失败

### 前端修复
3. **app/frontend/package.json**
   - 修改 `dev` 脚本：`next dev -H 127.0.0.1 -p 3010`
   - 固定前端端口为 3010

4. **app/frontend/app/api_proxy/[...path]/route.ts** (新建)
   - 创建 Next.js API Route 代理
   - 转发所有请求到后端 `BACKEND_URL`（从 .env.local 读取）
   - 超时设置：30s（开发环境）
   - 添加日志：`[Proxy START]` / `[Proxy END]` / `[Proxy TIMEOUT]` / `[Proxy ERROR]`
   - 超时时返回 JSON（status 200），包含 error/timeout_ms/url

5. **app/frontend/lib/api.ts**
   - 修改 `API_BASE` 为 `/api_proxy`（通过代理访问后端）
   - 超时设置：30s（与 proxy 一致）
   - 已有日志：`[API Request START]` / `[API Request END]` / `[API Request TIMEOUT]`

6. **app/frontend/app/merchant/page.tsx**
   - 合并 `fetchMetrics` 和 `fetchDiagnosis` 为 `fetchDashboard`
   - 使用 `/merchant/dashboard` 接口，传递 `include_items` 参数
   - 添加"加载完整数据"按钮（include_items=1）
   - 错误处理：显示完整 URL 和状态码

## 运行方式（三窗口分工）

### 终端窗口 #1（BACKEND）
```powershell
# 在项目根目录
python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info
```

**验证**：
```powershell
curl.exe -i "http://127.0.0.1:8000/docs"
# 预期：HTTP/1.1 200 OK
```

### 终端窗口 #2（FRONTEND）
```powershell
# 在 app/frontend 目录
cd app/frontend
npm run dev
```

**验证**：
```powershell
curl.exe -i "http://127.0.0.1:3010/"
# 预期：HTTP/1.1 200 OK
```

### 终端窗口 #3（TEST）
专门用于验证，不运行服务。

## 验证命令（终端窗口 #3）

### 1. 直接打后端（绕过前端）
```powershell
curl.exe "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**预期输出**：
- 后端控制台显示：
  ```
  [trace=12345] stage=overview duration_ms=150.2
  [trace=12345] stage=metrics duration_ms=200.5
  [trace=12345] stage=lifecycle duration_ms=300.1
  [trace=12345] stage=items_top duration_ms=0.0 SKIPPED: include_items=0
  [trace=12345] stage=items_opportunity duration_ms=0.0 SKIPPED: include_items=0
  [trace=12345] stage=advice duration_ms=5.0
  [trace=12345] stage=total duration_ms=655.8
  ```
- 返回 JSON 包含：`overview`, `metrics`, `lifecycle`, `items`, `advice`, `trace_id`, `total_ms`, `timings`
- `include_items=0` 时，`items.top.items` 和 `items.opportunity.items` 应为空数组

### 2. 打前端 proxy
```powershell
curl.exe "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**预期输出**：
- 前端控制台显示：
  ```
  [Proxy START] GET http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0
  [Proxy END] GET http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0 | duration=700ms | status=200
  ```
- 返回相同的 JSON（与直接打后端一致）

### 3. 页面验证
1. 打开浏览器：`http://127.0.0.1:3010/merchant`
2. 点击"刷新"按钮
3. 预期结果：
   - **10s 内一定结束**（要么出数据，要么出错误提示）
   - **不会无限 loading**
   - 浏览器 console 输出：
     ```
     [API Request START] /api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0
     [API Request END] /api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0 | duration=750ms | status=200
     ```
   - 如果出错，页面显示红色错误框（包含完整 URL 和状态码）
   - 错误框有"重试"按钮

### 4. 测试超时场景
如果后端响应很慢（>30s），会看到：
- 前端 console: `[API Request TIMEOUT] ... | duration=30000ms | timeout=30000ms`
- 页面：显示"请求超时（30000ms）: http://..."错误信息
- Loading 状态会立即结束，不会卡死

## 环境变量

**app/frontend/.env.local**（如果不存在则创建）：
```
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**注意**：不要随意修改 `.env.local`，除非有明确原因。

## 关键改进

1. ✅ **端口固定**：后端 8000，前端 3010
2. ✅ **超时控制**：前端/proxy 30s，后端有性能日志
3. ✅ **可观测性**：所有请求都有 start/end/duration/status 日志
4. ✅ **根因修复**：
   - 修复所有 `fetchone()[0]` 判空问题
   - 确保每个请求独立 DuckDB 连接
   - 慢查询拆分（include_items=0 默认不查询 items）
5. ✅ **错误处理**：部分失败时返回 degraded=true，但 HTTP 200，页面仍可渲染
6. ✅ **Loading 保证**：无论成功失败，finally 中一定 setLoading(false)

## 后续优化建议

1. **数据库索引**：如果 `item_funnel_features` 表很大，考虑在 `item_id`, `pv` 等列上建索引
2. **查询优化**：`items_opportunity` 的 SQL 可以进一步优化（例如使用物化视图）
3. **缓存**：对于不经常变化的数据（如 overview），可以考虑添加缓存层

