@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   Git Push Script
echo ========================================
echo.

REM Solicitar mensaje de commit
set /p mensaje="Ingresa el mensaje del commit: "

if "%mensaje%"=="" (
    echo Error: El mensaje no puede estar vacio
    pause
    exit /b 1
)

REM Ejecutar comandos git
echo.
echo [1/3] Agregando archivos...
"C:\Program Files\Git\bin\git.exe" add .

echo [2/3] Haciendo commit...
"C:\Program Files\Git\bin\git.exe" commit -m "%mensaje%"

echo [3/3] Enviando a GitHub...
"C:\Program Files\Git\bin\git.exe" push

echo.
echo ========================================
echo   Completado!
echo ========================================
echo.
pause
