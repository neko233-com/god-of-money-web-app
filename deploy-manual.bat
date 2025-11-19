@echo off
REM 手动部署 dist 到 gh-pages 分支

echo 🔨 开始构建...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 构建失败！
    exit /b 1
)

echo 📦 构建成功！

echo 🚀 推送到 gh-pages 分支...

cd dist

if exist .git (
    rmdir /s /q .git
)

git init
git add -A
git commit -m "部署: %date% %time%"
git branch -M gh-pages
git remote add origin https://github.com/neko233-com/god-of-money-web-app.git
git push -f origin gh-pages

cd ..

echo.
echo ✅ 部署完成！
echo 🌐 访问: https://neko233-com.github.io/god-of-money-web-app/
