# Render 部署（前端 + 后端）

## 0. 前置条件

- 代码已推送到 GitHub 仓库
- 后端使用 FastAPI（入口：`backend/main.py`）
- 前端使用 Next.js（目录：`frontend/`）

## 1. 在 Render 创建 Blueprint

1. 打开 Render 控制台 → New → Blueprint
2. 选择你的 GitHub 仓库
3. Render 会读取根目录的 `render.yaml` 并创建两个 Web Service：
   - `forecastpro-backend`
   - `forecastpro-frontend`

## 2. 配置后端环境变量

当前版本不依赖 LLM，无需配置额外的 LLM 环境变量。

## 3. 配置前端指向后端

部署完后端会生成一个 URL，例如：

- `https://forecastpro-backend-xxxx.onrender.com`

把这个 URL 填到 `forecastpro-frontend` 的环境变量：

- `API_BASE_URL=https://forecastpro-backend-xxxx.onrender.com`
- `NEXT_PUBLIC_API_BASE_URL=https://forecastpro-backend-xxxx.onrender.com`

注意：`render.yaml` 里默认是占位 `https://RENDER_BACKEND_URL`，你需要在 Render 控制台里覆盖为真实后端 URL。

## 4. 验证

- 后端健康检查：
  - `https://<backend>/health` 应返回 `{"ok": true}`
- 前端主页：
  - `https://<frontend>/` 打开后即可上传 CSV/Excel

## 5. 常见问题

### 5.1 xgboost 安装慢/失败

Render Free 资源有限，`xgboost` 可能安装很慢或失败。
如果遇到这种情况，可以先临时从 `requirements.txt` 移除 `xgboost` 让服务先上线，再做依赖优化。

### 5.2 公网资源消耗

如果开放公网，任何人都可以调用 `/api/forecast` 触发模型训练与预测，可能占用资源。
