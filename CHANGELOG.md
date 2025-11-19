# 更新日志

## 2025-11-20 (v2)

### 🚀 部署优化

1. **改进部署方式**
   - 从 GitHub Actions artifact 改为直接推送 `dist` 到 `gh-pages` 分支
   - 使用 `peaceiris/actions-gh-pages@v4` action
   - 更稳定可靠的部署流程

2. **添加手动部署选项**
   - 创建 `deploy-manual.bat` (Windows) 手动部署脚本
   - 创建 `deploy-manual.sh` (Linux/Mac) 手动部署脚本
   - 支持本地构建后直接推送到 gh-pages

3. **修复构建问题**
   - 添加 `esbuild` 依赖包
   - 解决 rolldown-vite 构建错误
   - 本地测试构建成功

### 📝 部署方式

**自动部署（推荐）：**
```bash
deploy.bat "提交信息"  # 推送到 main，自动触发 CI/CD
```

**手动部署：**
```bash
deploy-manual.bat  # 本地构建并推送 dist 到 gh-pages
```

## 2025-11-20 (v1)

### 🎨 界面优化

1. **布局优化 - 右侧内容区域最大化**
   - 修改 `Layout.vue`，为侧边栏添加 `flex-shrink: 0` 和 `min-width`
   - 右侧主内容区域添加 `min-width: 0` 和 `width: 100%`，确保充分利用可用空间
   - 主内容区域添加 `overflow-x: hidden` 防止横向溢出

2. **页面容器优化**
   - 将所有页面的 `max-width` 从 `1200px` 增加到 `1600px`
   - 添加 `width: 100%` 确保充分利用可用宽度
   - 添加水平内边距 `padding: 0 20px`
   - 添加 `box-sizing: border-box` 确保边距计算正确

3. **响应式布局增强**
   - 添加平板设备适配 (≤768px)：侧边栏宽度调整为 200px
   - 添加移动设备适配 (≤480px)：垂直布局，侧边栏折叠
   - 优化各设备下的内边距和间距

### 🚀 GitHub Pages 自动部署

1. **GitHub Actions 工作流**
   - 创建 `.github/workflows/deploy.yml`
   - 配置自动构建和部署流程
   - 推送到 `main` 分支自动触发部署

2. **Vite 配置优化**
   - 设置 `base: '/god-of-money-web-app/'` 适配 GitHub Pages
   - 配置生产构建选项
   - 启用代码压缩和优化

3. **部署文档**
   - 创建 `DEPLOYMENT.md` 详细部署指南
   - 更新 `README.md` 添加在线演示链接
   - 创建快速部署脚本 `deploy.bat` (Windows) 和 `deploy.sh` (Linux/Mac)

### 📝 文件清单

**新增文件：**
- `.github/workflows/deploy.yml` - GitHub Actions 工作流
- `DEPLOYMENT.md` - 部署文档
- `deploy.bat` - Windows 快速部署脚本
- `deploy.sh` - Linux/Mac 快速部署脚本
- `CHANGELOG.md` - 本文件

**修改文件：**
- `src/components/Layout.vue` - 布局优化和响应式设计
- `src/views/CommercialLoan.vue` - 容器宽度优化
- `src/views/HousingLoan.vue` - 容器宽度优化
- `src/views/CombinedLoan.vue` - 容器宽度优化
- `src/views/RiskAssessment.vue` - 容器宽度优化
- `vite.config.ts` - 添加 GitHub Pages 配置
- `README.md` - 添加部署说明和在线演示链接

### 🌐 在线访问

项目已部署到 GitHub Pages：
https://neko233-com.github.io/god-of-money-web-app/

### 📦 如何使用

**开发环境：**
```bash
npm install
npm run dev
```

**快速部署到 GitHub Pages：**
```bash
# Windows
deploy.bat "你的提交信息"

# Linux/Mac
./deploy.sh "你的提交信息"
```

### ✨ 主要改进点

1. ✅ 右侧内容区域始终最大化利用可用空间
2. ✅ 侧边栏宽度固定，不会随内容变化
3. ✅ 响应式设计，适配移动端、平板、桌面设备
4. ✅ 自动化部署，推送即发布
5. ✅ 生产环境优化，代码压缩和性能提升
