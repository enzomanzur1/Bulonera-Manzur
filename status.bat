@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   Git Status
echo ========================================
echo.

"C:\Program Files\Git\bin\git.exe" status

echo.
pause
