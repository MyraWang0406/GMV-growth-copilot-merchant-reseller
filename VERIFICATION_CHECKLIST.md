# 验证清单

按照以下步骤验证本地开发环境是否正常工作。

## 前置检查

- [ ] Python 3.10+ 已安装
- [ ] Node.js 18+ 已安装
- [ ] 后端依赖已安装：`pip install -r requirements.txt`
- [ ] 前端依赖已安装：`cd app/frontend && npm install`
- [ ] `.env.local` 文件存在：`app/frontend/.env.local`，内容包含 `BACKEND_URL=http://127.0.0.1:8000`

## 步骤 1：检查端口占用

**Windows PowerShell**：
```powershell
netstat -ano | findstr ":8000"
netstat -ano | findstr ":3010"
```

**预期**：如果端口被占用，会显示 PID 和进程名。如果为空，说明端口可用。

**如果端口被占用**：
```powershell
taskkill /PID <PID> /F
```

## 步骤 2：启动后端（窗口 A）

**命令**：
```bash
python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info
```

**预期输出**：
```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**验证**：
```bash
curl http://127.0.0.1:8000/health
```

**预期**：返回 `{"status":"ok"}`

## 步骤 3：启动前端（窗口 B）

**命令**：
```bash
cd app/frontend
npm run dev
```

**预期输出**：
```
  ▲ Next.js 14.0.4
  - Local:        http://127.0.0.1:3010
  - Ready in X.Xs
```

**验证**：
```bash
curl http://127.0.0.1:3010/
```

**预期**：返回 HTML 内容（状态码 200）

## 步骤 4：验证后端接口（窗口 C）

**测试 1：健康检查**
```bash
curl http://127.0.0.1:8000/health
```

**预期**：
- 状态码：200
- 响应：`{"status":"ok"}`

**测试 2：商家 Dashboard（快速模式）**
```bash
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**预期**：
- 状态码：200
- 响应包含：`overview`, `metrics`, `lifecycle`, `items`, `advice`, `trace_id`, `total_ms`, `timings`
- `items.top.items` 和 `items.opportunity.items` 应为空数组（因为 `include_items=0`）
- 后端控制台显示性能日志：
  ```
  [trace=xxxxx] stage=overview duration_ms=xxx
  [trace=xxxxx] stage=metrics duration_ms=xxx
  [trace=xxxxx] stage=lifecycle duration_ms=xxx
  [trace=xxxxx] stage=items_top duration_ms=0.0 SKIPPED: include_items=0
  [trace=xxxxx] stage=items_opportunity duration_ms=0.0 SKIPPED: include_items=0
  [trace=xxxxx] stage=advice duration_ms=xxx
  [trace=xxxxx] stage=total duration_ms=xxx
  ```
- `total_ms` 应该 < 3000ms（快速模式）

**测试 3：商家 Dashboard（完整模式）**
```bash
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=1"
```

**预期**：
- 状态码：200
- `items.top.items` 和 `items.opportunity.items` 包含数据
- 后端日志显示 `items_top` 和 `items_opportunity` 的耗时

## 步骤 5：验证前端代理（窗口 C）

**测试：通过前端代理访问后端**
```bash
curl "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**预期**：
- 状态码：200
- 响应与直接访问后端一致
- 前端控制台显示：
  ```
  [Proxy Config] BACKEND_URL=http://127.0.0.1:8000
  [Proxy START] GET http://127.0.0.1:8000/merchant/dashboard?...
  [Proxy END] GET http://127.0.0.1:8000/merchant/dashboard?... | duration=xxxms | status=200
  ```

## 步骤 6：浏览器验证

**打开浏览器**：
1. 访问：http://127.0.0.1:3010/merchant
2. 点击"刷新"按钮

**预期**：
- ✅ 页面在 10s 内加载完成（要么显示数据，要么显示错误提示）
- ✅ 不会无限 loading
- ✅ 浏览器 Console 显示：
  ```
  [API Request START] /api_proxy/merchant/dashboard?...
  [API Request END] /api_proxy/merchant/dashboard?... | duration=xxxms | status=200
  ```
- ✅ 如果出错，页面显示红色错误框（包含完整 URL 和状态码）
- ✅ 错误框有"重试"按钮

## 步骤 7：测试超时场景

**模拟慢查询**（如果后端支持）：
```bash
# 如果后端有慢查询，等待 30s 后应该返回超时错误
curl "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=1"
```

**预期**：
- 如果超过 30s，前端返回：
  ```json
  {
    "error": "timeout",
    "url": "http://127.0.0.1:8000/merchant/dashboard?...",
    "timeout_ms": 30000,
    "message": "代理请求超时（30000ms）"
  }
  ```
- 状态码：200（不是 504）
- 前端控制台显示：`[Proxy TIMEOUT] ... | duration=30000ms | timeout=30000ms`

## 步骤 8：测试并发请求

**并发测试**（可选）：
```bash
# 同时发送多个请求
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0" &
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0" &
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0" &
wait
```

**预期**：
- ✅ 所有请求都成功返回（不出现 DuckDB pending result 错误）
- ✅ 每个请求都有独立的 trace_id
- ✅ 后端日志显示每个请求的性能数据

## 步骤 9：测试空结果处理

**测试空表查询**（如果数据库为空）：
```bash
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=999&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**预期**：
- ✅ 不出现 `TypeError: 'NoneType' object is not subscriptable`
- ✅ 返回空数据或错误信息（但不是崩溃）
- ✅ 如果部分查询失败，返回 `degraded: true` 和 `errors: [...]`

## 步骤 10：验证端口固定

**重启前端**：
1. 停止前端（Ctrl+C）
2. 重新启动：`cd app/frontend && npm run dev`

**预期**：
- ✅ 前端始终在 `http://127.0.0.1:3010` 启动
- ✅ 不会随机选择其他端口（如 3001, 3002 等）

**重启后端**：
1. 停止后端（Ctrl+C）
2. 重新启动：`python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info`

**预期**：
- ✅ 后端始终在 `http://127.0.0.1:8000` 启动

## 总结

如果所有步骤都通过，说明：
- ✅ 端口固定成功（前端 3010，后端 8000）
- ✅ 前后端通信正常
- ✅ 超时处理正常
- ✅ DuckDB 并发安全
- ✅ 空结果处理正常
- ✅ 性能日志正常

如果某个步骤失败，请参考 README.md 中的"常见问题排查"部分。

