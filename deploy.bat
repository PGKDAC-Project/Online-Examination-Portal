@echo off
REM Online Examination Portal - Production Deployment Script for Windows

echo Starting Online Examination Portal deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Create necessary directories
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

REM Set environment variables for production
if not defined MYSQL_ROOT_PASSWORD set MYSQL_ROOT_PASSWORD=secure_root_password
if not defined MYSQL_PASSWORD set MYSQL_PASSWORD=secure_user_password
if not defined JWT_SECRET set JWT_SECRET=617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4

REM Build and start services
echo Building and starting services...
docker-compose down
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo Checking service health...

REM Check MySQL
docker-compose exec mysql mysqladmin ping -h localhost --silent >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL is running
) else (
    echo ✗ MySQL is not responding
    exit /b 1
)

REM Check Spring Boot backend
curl -f http://localhost:8080/oep/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Spring Boot backend is running
) else (
    echo ✗ Spring Boot backend is not responding
)

REM Check .NET Admin Service
curl -f http://localhost:7097/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ .NET Admin Service is running
) else (
    echo ✗ .NET Admin Service is not responding
)

REM Check Frontend
curl -f http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is not responding
)

echo Deployment completed!
echo Access the application at: http://localhost:5173
echo Admin API documentation: http://localhost:7097/swagger
echo Spring Boot API documentation: http://localhost:8080/oep/swagger-ui.html

REM Show running containers
echo Running containers:
docker-compose ps

pause