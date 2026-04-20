@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title DPS 網站一鍵推送

echo.
echo ========================================
echo   DPS 網站一鍵推送
echo ========================================
echo.

REM 讓這個 bat 放在 Git 專案資料夾裡直接雙擊就能用
cd /d "%~dp0"

if not exist ".git" (
    echo [錯誤] 這個檔案目前不在 Git 專案資料夾內。
    echo 請把這個 bat 放到你的 dps-simulator 專案根目錄再執行。
    echo.
    pause
    exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
    echo [錯誤] 找不到 Git，請先安裝 Git for Windows。
    echo.
    pause
    exit /b 1
)

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HH-mm-ss"') do set "STAMP=%%i"
set "MSG=update %STAMP%"

echo [1/3] git add .
git add .
if errorlevel 1 (
    echo.
    echo [錯誤] git add 失敗
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] git commit -m "%MSG%"
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "%MSG%"
    if errorlevel 1 (
        echo.
        echo [錯誤] git commit 失敗
        echo.
        pause
        exit /b 1
    )
) else (
    echo 沒有新的變更可提交，略過 commit。
)

echo.
echo [3/3] git push
git push
if errorlevel 1 (
    echo.
    echo [錯誤] git push 失敗
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   已成功推送到 GitHub
echo ========================================
echo Commit 訊息：%MSG%
echo.
echo 如果網站沒立刻更新，等幾秒後再 Ctrl+F5 重整。
echo.
pause
