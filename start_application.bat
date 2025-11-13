@echo off
echo Starting Shop Lite Application with Docker Compose...

REM Check if Docker is installed
docker --version 2>nul
if %errorlevel% neq 0 (
    echo Docker is not installed or not in PATH. Please install Docker Desktop.
    exit /b 1
)

REM Run Docker Compose
docker-compose up -d

echo Shop Lite is starting up! 
echo - Backend will be available at: http://localhost:8080
echo - Frontend will be available at: http://localhost:3000
echo.
echo To view logs use: docker-compose logs -f
echo To stop the application use: docker-compose down