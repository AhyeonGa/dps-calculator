@echo off
title DPS Push
cd /d "%~dp0"

echo.
echo ===== DPS Push =====
echo.

git add .
git commit -m "update"
git push

echo.
echo Done.
pause
