# 10分钟快速启动指南

## 前置检查

- [ ] Python 3.10+ 已安装
- [ ] Node.js 18+ 已安装
- [ ] 已安装依赖：`pip install -r requirements.txt` 和 `cd app/frontend && npm install`

## 三窗口启动（10分钟内完成）

### 窗口 A（后端）

**打开 PowerShell，执行**：
```powershell
# 确保在项目根目录
cd D:\Download\cursor\cps-growth-copilot

# 启动后端
python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info
```

**等待看到**：
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**验证**（新开一个 PowerShell 窗口，执行）：
```powershell
curl http://127.0.0.1:8000/health
```
**预期**：`{"status":"ok"}`

---

### 窗口 B（前端）

**打开新的 PowerShell，执行**：
```powershell
# 切换到前端目录
cd D:\Download\cursor\cps-growth-copilot\app\frontend

# 启动前端
npm run dev
```

**等待看到**：
```
▲ Next.js 14.0.4
- Local:        http://127.0.0.1:3010
✓ Ready in X.Xs
```

**重要**：保持这个窗口打开，不要关闭！

**验证**（新开一个 PowerShell 窗口，执行）：
```powershell
# 检查端口监听
netstat -ano | findstr ":3010"
# 预期：看到 LISTENING 状态

# 检查 HTTP 响应
curl -I http://127.0.0.1:3010/
# 预期：HTTP/1.1 200 OK
```

---

### 窗口 C（验证）

**打开新的 PowerShell，执行以下 3 条命令**：

**1. 检查后端健康**：
```powershell
curl http://127.0.0.1:8000/health
```
**预期**：`{"status":"ok"}`

**2. 检查前端响应**：
```powershell
curl -I http://127.0.0.1:3010/
```
**预期**：`HTTP/1.1 200 OK`

**3. 测试完整链路**：
```powershell
curl "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```
**预期**：返回 JSON 数据，包含 `overview`、`metrics`、`lifecycle`、`items`、`advice` 等字段

---

## 访问页面

打开浏览器，访问：
- **商家 Dashboard**: http://127.0.0.1:3010/merchant
- **淘客 Dashboard**: http://127.0.0.1:3010/taoke
- **前端首页**: http://127.0.0.1:3010/
- **后端 API 文档**: http://127.0.0.1:8000/docs

---

## 如果遇到问题

### ERR_CONNECTION_REFUSED

**检查端口是否监听**：
```powershell
netstat -ano | findstr ":3010"
netstat -ano | findstr ":8000"
```

**如果未监听**：
- 前端未启动 → 回到窗口 B，检查 `npm run dev` 输出
- 后端未启动 → 回到窗口 A，检查启动命令是否正确

**如果端口被占用**：
```powershell
# 查找占用进程
netstat -ano | findstr ":3010"
# 输出：TCP    127.0.0.1:3010    0.0.0.0:0    LISTENING    12345

# 结束进程（替换 12345 为实际 PID）
taskkill /PID 12345 /F
```

### 504 Gateway Timeout

**检查后端日志**（窗口 A）：
- 查看 `[trace=xxx] stage=xxx duration_ms=xxx` 日志
- 找出最慢的 stage

**快速解决**：
- 使用 `include_items=0` 参数（默认已启用）
- 检查数据库文件是否存在：`data/duckdb/cps_growth.duckdb`

### 无限 Loading

**检查浏览器 Console**：
- 打开浏览器开发者工具（F12）
- 查看 Console 标签页
- 查看是否有错误信息

**检查前端代码**：
- 确保所有 `fetchDashboard` 都有 `finally { setLoading(false) }`
- 确保 `apiGet` 有 `timeoutMs: 30000`

---

## 成功标志

✅ 窗口 A：看到 `INFO:     Uvicorn running on http://127.0.0.1:8000`
✅ 窗口 B：看到 `✓ Ready in X.Xs` 和 `http://127.0.0.1:3010`
✅ 窗口 C：3 条 curl 命令都返回预期结果
✅ 浏览器：能打开 http://127.0.0.1:3010/merchant，30s 内显示数据或错误（不无限 loading）

