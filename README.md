# CPS Growth Copilot v1.0 - 淘客侧

CPS Growth Copilot 是一个基于真实公开数据的智能推荐系统，专为淘客侧设计。本项目严格使用真实数据，不包含任何虚构业务数据，也不使用爬虫。

## 核心特性

- ✅ **真实数据**: 使用 HuggingFace Amazon Reviews 2023 真实数据集
- ✅ **可解释推荐**: 每个推荐都有明确的理由（reasons）
- ✅ **配置化护栏**: 通过 YAML 配置灵活控制推荐质量
- ✅ **轻量级数据库**: 使用 DuckDB，无需独立数据库服务
- ✅ **完整测试**: 包含护栏系统的单元测试

## 🚀 快速开始（本地开发）

### 前置要求

- Python 3.10+
- Node.js 18+ (用于前端)
- pip, npm

### 安装依赖

**后端依赖**：
```bash
pip install -r requirements.txt
```

**前端依赖**：
```bash
cd app/frontend
npm install
```

### 环境配置

**前端环境变量**（`app/frontend/.env.local`）：
```env
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**端口配置**（固定，不要修改）：
- 后端：`8000` (在启动命令中固定)
- 前端：`3010` (在 `package.json` 中固定)

## 📋 本地运行（最少步骤）

### 三窗口分工

| 窗口 | 用途 | 目录 | 命令 | 成功标志 |
|------|------|------|------|----------|
| **A** | 后端服务 | 项目根目录 | `python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info` | 看到 `INFO: Uvicorn running on http://127.0.0.1:8000` |
| **B** | 前端服务 | `app/frontend` | `cd app/frontend`<br>`npm run dev` | 看到 `✓ Ready in X.Xs` 和 `http://127.0.0.1:3010` |
| **C** | 验证/排查 | 任意目录 | 执行 curl 命令验证 | 见下方验证命令 |

**重要提示**：
- **窗口 B 必须在 `app/frontend` 目录执行 `npm run dev`**，否则会报错：`npm error ENOENT: Could not read package.json`
- 前端必须在前台运行，**不要关闭窗口 B**，否则前端会停止
- 如果端口被占用，脚本会提示可复制的 `taskkill` 命令（PID 是真实数字）

### 一键启动（推荐）

**Windows PowerShell**：
```powershell
.\scripts\dev.ps1
```

脚本会自动：
1. ✅ 检查端口占用（8000/3010），如果被占用会打印真实 PID 和可复制的 `taskkill` 命令
2. ✅ 启动后端，等待健康检查通过
3. ✅ 启动前端，确保在 `app/frontend` 目录执行
4. ✅ 自动验证：curl 检查后端和前端是否正常
5. ✅ 打印访问链接和查看日志的命令

### 固定访问链接

启动成功后，访问以下链接：

- **商家 Dashboard**: http://127.0.0.1:3010/merchant
- **淘客 Dashboard**: http://127.0.0.1:3010/taoke
- **前端首页**: http://127.0.0.1:3010/
- **后端 API 文档**: http://127.0.0.1:8000/docs
- **后端健康检查**: http://127.0.0.1:8000/health

### 启动方式（三窗口分工）

#### 方式一：使用自检脚本（推荐）

**Windows PowerShell**：
```powershell
.\scripts\dev.ps1
```

脚本会自动：
1. 检查端口占用（8000/3010）
2. 启动后端，等待健康检查通过
3. 启动前端
4. 打印访问链接

#### 方式二：手动启动（三窗口，推荐）

**窗口 A（后端）**：

**目录**：项目根目录（`D:\Download\cursor\cps-growth-copilot`）

**命令**：
```bash
python -m uvicorn app.api.main:app --host 127.0.0.1 --port 8000 --log-level info
```

**成功标志**：
- 看到 `INFO:     Uvicorn running on http://127.0.0.1:8000`
- 看到 `INFO:     Application startup complete.`
- 访问 `http://127.0.0.1:8000/health` 返回 `{"status":"ok"}`

**常见失败处理**：
- **端口被占用**：
  ```powershell
  netstat -ano | findstr ":8000"
  taskkill /PID <PID> /F
  ```
- **依赖缺失**：`pip install -r requirements.txt`
- **模块未找到**：检查 Python 环境，确保在正确的虚拟环境中

**窗口 B（前端）**：

**目录**：`app/frontend`（必须先 `cd app/frontend`）

**命令**：
```bash
cd app/frontend
npm run dev
```

**成功标志**：
- 看到 `▲ Next.js 14.0.4`
- 看到 `- Local:        http://127.0.0.1:3010`
- 看到 `✓ Ready in X.Xs`（**重要：必须看到这行**）
- 访问 `http://127.0.0.1:3010/` 能打开页面

**注意**：
- 前端必须在前台运行，**不要关闭窗口**，否则前端会停止
- 如果看到端口被占用错误，先释放端口再启动

**常见失败处理**：
- **端口被占用**：
  ```powershell
  netstat -ano | findstr ":3010"
  taskkill /PID <PID> /F
  ```
- **依赖缺失**：`npm install`
- **编译错误**：查看错误信息，修复代码问题

**窗口 C（测试/验证）**：

**目录**：任意目录（不运行服务，只执行验证命令）

**用途**：用于执行 curl 命令验证接口，不运行服务。

**验证命令**（在窗口 C 执行）：
```powershell
# 1. 检查后端健康
curl http://127.0.0.1:8000/health
# 预期：{"status":"ok"}

# 2. 检查前端是否在监听
netstat -ano | findstr ":3010"
# 预期：看到 LISTENING 状态，Local Address 为 127.0.0.1:3010

# 3. 检查前端 HTTP 响应
curl -I http://127.0.0.1:3010/
# 预期：HTTP/1.1 200 OK

# 4. 测试完整链路（通过前端代理访问后端）
curl "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
# 预期：返回 JSON 数据，包含 overview/metrics/lifecycle/items/advice
```

### 访问链接

启动成功后，访问以下链接：

- **前端首页**: http://127.0.0.1:3010/
- **商家 Dashboard**: http://127.0.0.1:3010/merchant
- **淘客 Dashboard**: http://127.0.0.1:3010/taoke
- **后端 API 文档**: http://127.0.0.1:8000/docs
- **后端健康检查**: http://127.0.0.1:8000/health

### 常见问题排查

#### ERR_CONNECTION_REFUSED（连接被拒绝）

**现象**：浏览器访问 http://127.0.0.1:3010 显示 "ERR_CONNECTION_REFUSED"

**原因**：前端 dev server 没有在 3010 端口监听

**排查步骤**（按顺序执行）：

1. **检查 3010 端口是否在监听**：
   ```powershell
   netstat -ano | findstr ":3010"
   ```
   - **如果无输出**：说明端口没有被监听，前端未启动或启动失败
   - **如果有输出**：查看 PID，确认是否是 node 进程

2. **检查前端进程是否在运行**：
   ```powershell
   tasklist | findstr node
   ```
   - 如果没有 node 进程，说明前端未启动
   - 如果有 node 进程，检查是否在正确的目录运行

3. **检查前端是否能访问**：
   ```powershell
   curl http://127.0.0.1:3010/
   ```
   - **如果返回 HTML**：说明前端正常，可能是浏览器缓存问题
   - **如果连接被拒绝**：说明前端确实没有监听 3010

**解决方法**：

1. **如果端口被占用**：
   ```powershell
   # 查找占用 3010 的进程
   netstat -ano | findstr ":3010"
   # 结束进程（替换 <PID> 为实际 PID）
   taskkill /PID <PID> /F
   ```

2. **如果前端未启动**：
   - 检查是否在正确的目录：`cd app/frontend`
   - 检查 package.json 是否存在：`Test-Path package.json`
   - 手动启动前端：`npm run dev`
   - 查看启动日志，确认是否显示 "Ready on http://127.0.0.1:3010"

3. **如果使用 dev.ps1 脚本**：
   - 脚本会在前台启动前端，**不要关闭窗口**
   - 如果脚本退出，前端也会停止
   - 建议：后端用脚本启动，前端手动在新窗口启动

**验证前端是否正常**（3条命令）：
```powershell
# 1. 检查端口监听
netstat -ano | findstr ":3010"
# 预期：看到 LISTENING 状态，Local Address 为 127.0.0.1:3010

# 2. 检查 HTTP 响应
curl http://127.0.0.1:3010/
# 预期：返回 HTML 内容（状态码 200）

# 3. 浏览器访问
# 打开浏览器访问：http://127.0.0.1:3010/
# 预期：看到页面内容，不是 ERR_CONNECTION_REFUSED
```

#### EADDRINUSE（端口被占用）
- **原因**：8000 或 3010 端口已被其他进程占用
- **解决**：
  1. 查找占用进程：`netstat -ano | findstr ":8000"`
  2. 结束进程：`taskkill /PID <PID> /F`
  3. 或使用自检脚本 `dev.ps1`，它会提示端口占用情况

#### 504 Gateway Timeout / 请求超时
- **原因**：后端查询慢，超过 30s 超时
- **解决**：
  1. 检查后端日志，查看哪个 stage 慢（日志格式：`[trace=xxxxx] stage=xxx duration_ms=xxx`）
  2. 使用 `include_items=0` 参数快速返回（默认已启用）
  3. 检查数据库文件是否存在：`data/duckdb/cps_growth.duckdb`

#### 无限 Loading
- **原因**：前端请求超时或后端异常
- **解决**：
  1. 打开浏览器 Console，查看错误信息
  2. 检查后端日志，查看是否有异常
  3. 确保所有请求都有 `finally { setLoading(false) }`（已修复）

#### DuckDB 错误：Attempting to execute an unsuccessful or closed pending query result
- **原因**：DuckDB 连接被并发复用（已修复：每个请求独立连接）
- **解决**：如果仍出现，检查是否有全局 connection 对象（不应存在）

### 导入数据

```bash
# 从 HuggingFace 导入 Amazon Reviews 数据
python scripts/bootstrap_data.py --meta-limit 20000 --reviews-limit 60000 --scan-limit 300000
```

参数说明：
- `--meta-limit`: 商品元数据数量限制（默认 20000）
- `--reviews-limit`: 评价数据数量限制（默认 60000）
- `--scan-limit`: 扫描数据集的数量限制（默认 300000）

### 检查数据

```bash
python scripts/inspect_db.py
```

### 验证接口（窗口 C）

**直接访问后端**：
```bash
# 健康检查
curl http://127.0.0.1:8000/health

# 商家 Dashboard（快速模式，不包含 items）
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"

# 商家 Dashboard（完整模式，包含 items）
curl "http://127.0.0.1:8000/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=1"
```

**通过前端代理访问**：
```bash
# 通过前端代理访问后端
curl "http://127.0.0.1:3010/api_proxy/merchant/dashboard?merchant_id=1&lookback_days=7&items_limit=20&min_pv=0&include_items=0"
```

**推荐接口**：
```bash
# 获取推荐（关键词搜索）
curl "http://127.0.0.1:8000/api/recommend?k=10&q=serum"

# 获取推荐（全局 Top-N）
curl "http://127.0.0.1:8000/api/recommend?k=10"

# 带价格过滤
curl "http://127.0.0.1:8000/api/recommend?k=10&q=serum&price_min=10&price_max=50"
```

## 项目结构

```
cps-growth-copilot/
├── app/
│   ├── api/              # FastAPI 路由
│   │   ├── main.py
│   │   └── routers/
│   │       └── recommend.py
│   ├── core/             # 核心配置和护栏
│   │   ├── settings.py
│   │   └── guardrails.py
│   ├── services/         # 推荐引擎和理由生成
│   │   ├── recommender.py
│   │   └── reasons.py
│   └── storage/          # DuckDB 存储层
│       └── db.py
├── configs/              # YAML 配置文件
│   ├── guardrails.yaml
│   ├── scoring.yaml
│   └── funnel_rules.yaml
├── docs/                 # 文档
│   ├── README.md
│   ├── PRD.md
│   ├── SCHEMA.md
│   └── EVAL_RUBRIC.md
├── scripts/              # 工具脚本
│   ├── bootstrap_data.py
│   ├── inspect_db.py
│   ├── import_tianchi_userbehavior.py
│   └── build_funnel_features.py
├── tests/                # 测试
│   └── test_guardrails.py
├── data/                 # 数据目录
│   ├── duckdb/           # DuckDB 数据库文件
│   └── raw/              # 原始数据文件
├── requirements.txt
└── README.md
```

## API 端点

### 推荐接口

- `GET /api/recommend`
  - `q`: 可选关键词（搜索商品标题）
  - `k`: 返回推荐数量（1-100，默认 10）
  - `price_min`: 可选最低价格覆盖
  - `price_max`: 可选最高价格覆盖

### 健康检查

- `GET /health`

### API 文档

访问 http://127.0.0.1:8000/docs 查看交互式 API 文档。

## 技术栈

- **Python**: 3.10+
- **FastAPI**: Web API 框架
- **DuckDB**: 轻量级分析数据库
- **HuggingFace datasets**: 数据加载
- **PyYAML**: 配置文件管理
- **pandas/numpy**: 数据处理

## 数据来源

### Amazon Reviews 2023
- **来源**: HuggingFace `McAuley-Lab/Amazon-Reviews-2023`
- **子集**: `raw_meta_All_Beauty` 和 `raw_review_All_Beauty`
- **用途**: 商品元数据和用户评价数据
- **特点**: 真实商品信息，真实用户评价

### Tianchi UserBehavior (预留)
- **来源**: 天池用户行为数据集
- **状态**: 骨架实现，待接入真实数据

## 配置说明

### 护栏配置 (`configs/guardrails.yaml`)

控制推荐过滤规则：
- 最低评分
- 最低评价数量
- 价格区间
- 品牌黑名单
- ASIN 黑名单

### 评分配置 (`configs/scoring.yaml`)

控制推荐评分计算：
- 评分权重
- 流行度权重
- 时效性权重

## 运行测试

```bash
# 运行护栏测试
pytest tests/test_guardrails.py -v
```

## 文档

详细文档请查看 `docs/` 目录：
- `docs/README.md` - 作品集说明
- `docs/PRD.md` - 产品需求文档
- `docs/SCHEMA.md` - 数据库 Schema
- `docs/EVAL_RUBRIC.md` - 评估标准

## 注意事项

- 本项目使用真实公开数据，不包含任何虚构业务数据
- 数据通过 HuggingFace datasets 加载，无需爬虫
- 推荐结果仅基于公开数据，不包含商业机密
- 首次运行需要从 HuggingFace 下载数据，可能需要一些时间

## 许可证

MIT

