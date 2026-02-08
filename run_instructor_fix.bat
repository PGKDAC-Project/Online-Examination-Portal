@echo off
echo Fixing course instructor mappings...
mysql -u root -pmanager student_instructor_service_db < fix_course_instructors.sql
echo Done! Instructor mappings have been updated.
pause
