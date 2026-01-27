@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Online Examination Portal - API Testing
echo ========================================
echo.

REM Test 1: Login as Admin
echo [TEST 1] Admin Login...
curl -s -X POST "http://localhost:8080/oep/auth/signin" -H "Content-Type: application/json" -d "{\"email\":\"admin@oep.com\",\"password\":\"admin@123\"}" > temp_login.json
for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_login.json') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%
echo Token: %TOKEN:~0,50%...
echo Status: SUCCESS
echo.

REM Test 2: Get All Users
echo [TEST 2] Get All Users...
curl -s -X GET "http://localhost:8080/oep/admin/users" -H "Authorization: Bearer %TOKEN%" > temp_users.json
findstr "email" temp_users.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 3: Get All Courses
echo [TEST 3] Get All Courses...
curl -s -X GET "http://localhost:8080/oep/admin/courses" -H "Authorization: Bearer %TOKEN%" > temp_courses.json
findstr "title" temp_courses.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 4: Create Course
echo [TEST 4] Create Course...
curl -s -X POST "http://localhost:8080/oep/admin/courses" -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -d "{\"courseCode\":\"TEST101\",\"title\":\"Test Course\",\"description\":\"Test Description\",\"instructorId\":2}" > temp_create_course.json
findstr "course_id" temp_create_course.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 5: Get Batches (Spring Boot)
echo [TEST 5] Get Batches (Spring Boot)...
curl -s -X GET "http://localhost:8080/oep/admin/batches" -H "Authorization: Bearer %TOKEN%" > temp_batches.json
findstr "batchName" temp_batches.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 6: .NET Admin Service - Get Batches
echo [TEST 6] Get Batches (.NET Admin Service)...
curl -s -X GET "http://localhost:7097/admin/batches" -H "Authorization: Bearer %TOKEN%" > temp_admin_batches.json
findstr "batchName" temp_admin_batches.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 7: .NET Admin Service - Get Announcements
echo [TEST 7] Get Announcements (.NET Admin Service)...
curl -s -X GET "http://localhost:7097/admin/announcements" -H "Authorization: Bearer %TOKEN%" > temp_announcements.json
findstr "title" temp_announcements.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 8: .NET Admin Service - Get System Settings
echo [TEST 8] Get System Settings (.NET Admin Service)...
curl -s -X GET "http://localhost:7097/admin/settings" -H "Authorization: Bearer %TOKEN%" > temp_settings.json
findstr "maintenanceMode" temp_settings.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 9: Login as Instructor
echo [TEST 9] Instructor Login...
curl -s -X POST "http://localhost:8080/oep/auth/signin" -H "Content-Type: application/json" -d "{\"email\":\"john.instructor@oep.com\",\"password\":\"admin@123\"}" > temp_instructor_login.json
for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_instructor_login.json') do set INST_TOKEN=%%a
set INST_TOKEN=%INST_TOKEN:"=%
set INST_TOKEN=%INST_TOKEN: =%
echo Token: %INST_TOKEN:~0,50%...
echo Status: SUCCESS
echo.

REM Test 10: Get Instructor Courses
echo [TEST 10] Get Instructor Courses...
curl -s -X GET "http://localhost:8080/oep/instructor/courses/2" -H "Authorization: Bearer %INST_TOKEN%" > temp_inst_courses.json
findstr "title" temp_inst_courses.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

REM Test 11: Login as Student
echo [TEST 11] Student Login...
curl -s -X POST "http://localhost:8080/oep/auth/signin" -H "Content-Type: application/json" -d "{\"email\":\"alice.student@oep.com\",\"password\":\"admin@123\"}" > temp_student_login.json
for /f "tokens=2 delims=:," %%a in ('findstr "token" temp_student_login.json') do set STU_TOKEN=%%a
set STU_TOKEN=%STU_TOKEN:"=%
set STU_TOKEN=%STU_TOKEN: =%
echo Token: %STU_TOKEN:~0,50%...
echo Status: SUCCESS
echo.

REM Test 12: Get Student Courses
echo [TEST 12] Get Student Courses...
curl -s -X GET "http://localhost:8080/oep/student/courses/4" -H "Authorization: Bearer %STU_TOKEN%" > temp_stu_courses.json
findstr "title" temp_stu_courses.json > nul
if %errorlevel%==0 (echo Status: SUCCESS) else (echo Status: FAILED)
echo.

echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Check temp_*.json files for detailed responses
echo.

REM Cleanup
del temp_*.json 2>nul

pause