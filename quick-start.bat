@echo off
echo Starting Online Examination Portal...

REM Check if MySQL is running
echo Checking MySQL...
sc query MySQL80 >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not running. Please start MySQL service first.
    pause
    exit /b 1
)

REM Start Spring Boot Backend
echo Starting Spring Boot Backend...
start "Spring Boot" cmd /k "cd oep_spring_backend && mvn spring-boot:run"

REM Wait 30 seconds
timeout /t 30 /nobreak

REM Start .NET Admin Service
echo Starting .NET Admin Service...
start "Admin Service" cmd /k "cd AdminServiceDotNET && dotnet run"

REM Wait 15 seconds
timeout /t 15 /nobreak

REM Start React Frontend
echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend-Application && npm run dev"

echo All services are starting...
echo Frontend: http://localhost:5173
echo Spring Boot API: http://localhost:8080/oep
echo Admin Service: http://localhost:7097

pause