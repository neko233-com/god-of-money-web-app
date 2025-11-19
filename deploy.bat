@echo off
REM 快速提交和部署脚本 (Windows)

if "%~1"=="" (
  echo 错误: 请提供提交信息
  echo 用法: deploy.bat "你的提交信息"
  exit /b 1
)

echo 📦 添加所有更改...
git add .

echo 💾 提交更改...
git commit -m "%~1"

echo 🚀 推送到 GitHub...
git push origin main

echo.
echo ✅ 完成！GitHub Actions 将自动部署到 GitHub Pages
echo 🌐 部署完成后访问: https://neko233-com.github.io/god-of-money-web-app/
