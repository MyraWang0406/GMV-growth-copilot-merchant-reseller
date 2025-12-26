# 根因判断树

## 问题：http://127.0.0.1:3010 无法访问

### 判断流程

```
访问 http://127.0.0.1:3010
│
├─ ERR_CONNECTION_REFUSED（连接被拒绝）
│  │
│  ├─ 检查 3010 端口是否监听
│  │  │
│  │  ├─ 未监听 → 前端 dev server 未启动或已崩溃
│  │  │  │
│  │  │  ├─ 检查进程：tasklist | findstr node
│  │  │  │  ├─ 无 node 进程 → 前端未启动
│  │  │  │  │  └─ 解决：cd app/frontend && npm run dev
│  │  │  │  │
│  │  │  │  └─ 有 node 进程但不在 3010 → 端口被占用或配置错误
│  │  │  │     └─ 解决：检查 package.json dev 脚本是否固定 3010
│  │  │  │
│  │  │  └─ 检查启动日志：npm run dev 输出
│  │  │     ├─ 端口被占用错误 → 3010 被其他进程占用
│  │  │     │  └─ 解决：netstat -ano | findstr ":3010" → taskkill /PID <PID> /F
│  │  │     │
│  │  │     ├─ 依赖缺失错误 → npm install
│  │  │     │
│  │  │     └─ 编译错误 → 修复代码错误
│  │  │
│  │  └─ 已监听但无法访问 → 防火墙/网络问题
│  │     └─ 解决：检查防火墙设置
│  │
│  └─ 504 Gateway Timeout / 请求超时（30s）
│     │
│     ├─ 前端超时 → 后端响应慢
│     │  │
│     │  ├─ 检查后端是否运行：curl http://127.0.0.1:8000/health
│     │  │  ├─ 无响应 → 后端未启动
│     │  │  │  └─ 解决：python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000
│     │  │  │
│     │  │  └─ 有响应 → 后端运行但查询慢
│     │  │     │
│     │  │     ├─ 检查后端日志：查看 [trace=xxx] stage=xxx duration_ms=xxx
│     │  │     │  ├─ 某个 stage > 3000ms → 慢查询
│     │  │     │  │  └─ 解决：使用 include_items=0 快速返回
│     │  │     │  │
│     │  │     │  └─ 所有 stage < 1000ms → 可能是网络问题
│     │  │     │
│     │  │     └─ 检查数据库：data/duckdb/cps_growth.duckdb 是否存在
│     │  │
│     │  └─ 前端未设置超时 → 无限等待
│     │     └─ 解决：确保 apiGet 有 timeoutMs: 30000，finally 中 setLoading(false)
│     │
│     └─ 无限 Loading（页面一直转圈）
│        │
│        ├─ 前端请求未完成且未超时
│        │  └─ 解决：检查 try/catch/finally，确保 finally 中 setLoading(false)
│        │
│        └─ 后端挂起/死锁
│           └─ 解决：检查后端日志，查看是否有异常或死锁
```

## 快速诊断命令

### 1. 检查端口监听（Windows）

```powershell
# 检查前端端口
netstat -ano | findstr ":3010"
# 预期：看到 LISTENING 状态，Local Address 为 127.0.0.1:3010
# 如果无输出 → 前端未启动

# 检查后端端口
netstat -ano | findstr ":8000"
# 预期：看到 LISTENING 状态，Local Address 为 127.0.0.1:8000
# 如果无输出 → 后端未启动
```

### 2. 检查进程

```powershell
# 检查 node 进程（前端）
tasklist | findstr node
# 预期：看到 node.exe 进程

# 检查 python 进程（后端）
tasklist | findstr python
# 预期：看到 python.exe 进程
```

### 3. 检查端口占用（如果端口被占用）

```powershell
# 查找占用 3010 的进程
netstat -ano | findstr ":3010"
# 输出示例：TCP    127.0.0.1:3010    0.0.0.0:0    LISTENING    12345
# PID 是 12345

# 结束进程
taskkill /PID 12345 /F
```

### 4. HTTP 健康检查

```powershell
# 检查后端
curl http://127.0.0.1:8000/health
# 预期：{"status":"ok"}

# 检查前端
curl -I http://127.0.0.1:3010/
# 预期：HTTP/1.1 200 OK
```

## 常见问题与解决

### 问题1：ERR_CONNECTION_REFUSED

**原因**：前端或后端未启动

**解决**：
1. 检查端口监听：`netstat -ano | findstr ":3010"`
2. 如果未监听，启动前端：`cd app/frontend && npm run dev`
3. 检查启动日志，确认看到 "Ready on http://127.0.0.1:3010"

### 问题2：端口被占用

**原因**：3010 或 8000 被其他进程占用

**解决**：
1. 查找占用进程：`netstat -ano | findstr ":3010"`
2. 结束进程：`taskkill /PID <PID> /F`
3. 重新启动服务

### 问题3：504 Gateway Timeout

**原因**：后端响应超过 30s

**解决**：
1. 检查后端日志，查看哪个 stage 慢
2. 使用 `include_items=0` 快速返回
3. 检查数据库文件是否存在

### 问题4：无限 Loading

**原因**：前端请求未完成且未设置超时，或 finally 中未 setLoading(false)

**解决**：
1. 检查前端代码，确保 try/catch/finally 中都有 setLoading(false)
2. 检查 apiGet 是否有 timeoutMs 设置
3. 检查浏览器 Console，查看是否有错误

