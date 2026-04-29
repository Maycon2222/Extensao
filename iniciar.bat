@echo off
REM Script de inicializacao da plataforma OPA
REM Duplo-clique neste arquivo para subir o servidor

echo.
echo ================================================
echo   OPA - Observatorio Popular Antifraude
echo ================================================
echo.
echo   Iniciando servidor em http://localhost:3456
echo   Pressione CTRL+C para parar
echo.
echo ================================================
echo.

cd /d "%~dp0"
call npx next dev --port 3456

pause
