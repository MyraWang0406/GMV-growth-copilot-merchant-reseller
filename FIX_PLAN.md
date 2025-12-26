# 修复计划：稳定本地开发环境

## 问题分析

### 当前现象
1. **端口漂移**：前端有时在3010，有时在其他端口，导致 ERR_CONNECTION_REFUSED
2. **超时/504**：/api_proxy/merchant/dashboard 经常 timeout 或 504 Gateway Timeout
3. **DuckDB 并发错误**：`Invalid Input Error: Attempting to execute an unsuccessful or closed pending query result`
4. **NoneType 错误**：`TypeError: 'NoneType' object is not subscriptable`（fetchone() 为空还取 [0]）

### 根因
1. **端口不固定**：Next.js 可能随机选择端口，package.json 虽有 -p 3010，但可能被环境变量覆盖
2. **DuckDB 连接复用**：多个请求可能共享同一个 connection，导致 pending query result 错误
3. **空结果未处理**：fetchone() 可能返回 None，但代码直接 [0] 访问
4. **慢查询未拆分**：items_top/items_opportunity 查询慢，导致整体超时

## 修复策略

### 1. 端口"唯一真相源"改造
- **前端**：
  - `package.json` dev 脚本：`next dev -H 127.0.0.1 -p 3010`（已固定）
  - `.env.local`：`BACKEND_URL=http://127.0.0.1:8000`，`NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`
  - 确保不使用 PORT 环境变量（或显式设置）
- **后端**：
  - 固定 `--port 8000`，`--host 127.0.0.1`
  - 在 README 中明确说明

### 2. 自检脚本（dev.ps1）
- 检查端口占用（8000/3010）
- 启动后端，等待健康检查
- 启动前端
- 打印访问链接

### 3. DuckDB 并发修复
- **禁止全局连接**：每个请求/函数调用都新建 `duckdb.connect(db_path, read_only=True)`
- **确保关闭**：每个连接都在 `try/finally` 中 `con.close()`
- **线程安全**：不共享 connection 对象

### 4. 空结果处理
- 所有 `fetchone()` 都判空：`row = cur.fetchone(); value = row[0] if row and len(row) > 0 and row[0] is not None else 0`
- 所有 `fetchall()` 都判空：`rows = cur.fetchall(); items = [r[0] for r in rows] if rows else []`

### 5. 慢查询拆分
- `/merchant/dashboard` 增加 `include_items=0/1` 参数（默认 0）
- `include_items=0`：只返回 metrics/segments，保证 < 3s
- `include_items=1`：包含 items_top/items_opportunity
- 前端默认 `include_items=0`，有按钮触发 `include_items=1`

### 6. Proxy 错误处理
- 使用 `.env.local` 的 `BACKEND_URL`
- 超时返回 JSON（status 200），包含 error/timeout_ms/url
- 记录详细日志：请求 URL、上游 URL、耗时、状态码

## 修改文件清单

1. `app/frontend/.env.local` - 创建/更新环境变量
2. `app/frontend/package.json` - 确保端口固定（已固定，需验证）
3. `scripts/dev.ps1` - 新建自检脚本
4. `app/api/merchant.py` - 修复 DuckDB 并发和空结果
5. `app/frontend/app/api_proxy/[...path]/route.ts` - 修复 proxy 错误处理
6. `app/api/main.py` - 确保有 /health 接口
7. `README.md` - 更新运行说明

## 验证清单

1. 执行 `scripts/dev.ps1`，检查端口占用
2. 后端启动成功，`/health` 返回 200
3. 前端启动成功，显示 "Ready on http://127.0.0.1:3010"
4. 浏览器访问 `http://127.0.0.1:3010/merchant`，不出现 ERR_CONNECTION_REFUSED
5. 点击刷新，10s 内返回数据或错误（不无限 loading）
6. 后端日志显示每个请求的 trace_id 和 stage duration
7. 测试 `include_items=0` 快速返回（< 3s）
8. 测试 `include_items=1` 完整数据返回
9. 测试并发请求，不出现 DuckDB pending result 错误
10. 测试空表查询，不出现 NoneType 错误

