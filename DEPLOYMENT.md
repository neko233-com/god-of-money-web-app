# 部署到 GitHub Pages

## 自动部署说明

本项目已配置 GitHub Actions 自动部署工作流。每次推送到 `main` 分支时，会自动构建并将 `dist` 目录推送到 `gh-pages` 分支。

## 首次部署设置

### 1. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 `Settings` (设置)
3. 在左侧菜单中找到 `Pages`
4. 在 `Source` (来源) 下选择 `Deploy from a branch`
5. 在 `Branch` 下选择 `gh-pages` 分支，目录选择 `/ (root)`
6. 点击 `Save`

### 2. 推送代码触发部署

```bash
git add .
git commit -m "配置 GitHub Pages 自动部署"
git push origin main
```

或使用快捷脚本：
```bash
# Windows
deploy.bat "你的提交信息"

# Linux/Mac
./deploy.sh "你的提交信息"
```

### 3. 查看部署状态

1. 进入仓库的 `Actions` 标签页
2. 查看最新的工作流运行状态
3. 部署成功后，网站将在以下地址可访问：
   ```
   https://neko233-com.github.io/god-of-money-web-app/
   ```

## 手动部署（可选）

如果你想本地构建后直接推送 dist 目录：

**Windows:**
```bash
deploy-manual.bat
```

**Linux/Mac:**
```bash
chmod +x deploy-manual.sh
./deploy-manual.sh
```

这会在本地构建项目，然后将 `dist` 目录强制推送到 `gh-pages` 分支。

## 工作流说明

`.github/workflows/deploy.yml` 配置了自动化部署流程：

- **触发条件**：推送到 main 分支或手动触发
- **构建步骤**：
  1. 检出代码
  2. 设置 Node.js 20
  3. 安装依赖 (npm ci)
  4. 构建项目 (npm run build)
- **部署步骤**：
  - 将 `dist` 目录推送到 `gh-pages` 分支
  - GitHub Pages 自动从 `gh-pages` 分支提供静态文件服务

## 本地测试生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 注意事项

1. 确保仓库是公开的，或者有 GitHub Pro/Team 账号（私有仓库需要付费才能使用 GitHub Pages）
2. 首次部署可能需要几分钟时间
3. 如果修改了仓库名称，需要同步修改 `vite.config.ts` 中的 `base` 配置

## 自定义域名（可选）

如果想使用自定义域名：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 在文件中写入你的域名，例如：`www.example.com`
3. 在域名提供商处配置 DNS CNAME 记录指向 `neko233-com.github.io`
