#!/bin/bash

# 手动部署 dist 到 gh-pages 分支

echo "🔨 开始构建..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo "📦 构建成功！"

echo "🚀 推送到 gh-pages 分支..."

cd dist

if [ -d .git ]; then
    rm -rf .git
fi

git init
git add -A
git commit -m "部署: $(date)"
git branch -M gh-pages
git remote add origin https://github.com/neko233-com/god-of-money-web-app.git
git push -f origin gh-pages

cd ..

echo ""
echo "✅ 部署完成！"
echo "🌐 访问: https://neko233-com.github.io/god-of-money-web-app/"
