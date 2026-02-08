-- Fix instructor assignments for courses
-- This script populates the course_instructors join table

USE student_instructor_service_db;

-- Clear existing mappings (if any)
DELETE FROM course_instructors;

-- Insert instructor mappings based on the course data
-- Course 1 (CS101) - John Instructor (user_id = 2)
INSERT INTO course_instructors (course_id, instructor_id) VALUES (1, 2);

-- Course 2 (CS102) - John Instructor (user_id = 2)
INSERT INTO course_instructors (course_id, instructor_id) VALUES (2, 2);

-- Course 3 (CS201) - Jane Instructor (user_id = 3)
INSERT INTO course_instructors (course_id, instructor_id) VALUES (3, 3);

-- Course 4 (CS202) - Jane Instructor (user_id = 3)
INSERT INTO course_instructors (course_id, instructor_id) VALUES (4, 3);

-- Course 7 (CSE443 - Web Based Java Programming) - Assign to John Instructor
-- Adjust the course_id if needed based on your actual data
INSERT INTO course_instructors (course_id, instructor_id) 
SELECT 7, 2 
WHERE EXISTS (SELECT 1 FROM courses WHERE course_id = 7)
AND NOT EXISTS (SELECT 1 FROM course_instructors WHERE course_id = 7 AND instructor_id = 2);

-- Verify the mappings
SELECT 
    c.course_id,
    c.course_code,
    c.title,
    u.user_id,
    u.user_name,
    u.email
FROM courses c
LEFT JOIN course_instructors ci ON c.course_id = ci.course_id
LEFT JOIN users u ON ci.instructor_id = u.user_id
ORDER BY c.course_id;
