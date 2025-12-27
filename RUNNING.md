# 运行与验证说明

快速启动（在 Codespaces 终端）:

```bash
# 从仓库根运行（确保已安装依赖）
./scripts/start-backend.sh
./scripts/start-frontend.sh
# 或：同时启动并查看日志
./scripts/start-all.sh
```

验证命令：

```bash
curl http://127.0.0.1:8000/health
curl 'http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7'
curl 'http://127.0.0.1:3010/'
curl 'http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7'
```

端口：
- 后端: `8000`
- 前端: `3010`

注意：如需在 Codespaces UI 中公开端口，请在端口面板将 `8000` 和 `3010` 标记为 Public。
