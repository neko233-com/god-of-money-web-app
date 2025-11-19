#!/bin/bash

# 快速提交和部署脚本

# 检查是否有提交信息
if [ -z "$1" ]; then
  echo "错误: 请提供提交信息"
  echo "用法: ./deploy.sh \"你的提交信息\""
  exit 1
fi

# 添加所有更改
echo "📦 添加所有更改..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "$1"

# 推送到远程仓库
echo "🚀 推送到 GitHub..."
git push origin main

echo "✅ 完成！GitHub Actions 将自动部署到 GitHub Pages"
echo "🌐 部署完成后访问: https://neko233-com.github.io/god-of-money-web-app/"
