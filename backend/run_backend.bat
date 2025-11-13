@echo off
echo Starting Shop Lite Backend...

REM Check if Java is installed
java -version 2>nul
if %errorlevel% neq 0 (
    echo Java is not installed or not in PATH. Please install Java 17 or later.
    exit /b 1
)

REM Check if jar file exists
if not exist "target/backend-0.1.0.jar" (
    echo Backend JAR file not found. 
    echo Please build the project first using Docker or Maven.
    exit /b 1
)

REM Start Spring Boot application
java -jar target/backend-0.1.0.jar

echo Backend application started.