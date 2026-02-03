-- Test data for Spring Boot Service Database (student_instructor_service_db)

USE student_instructor_service_db;

-- Insert test users
INSERT INTO users (user_id, user_name, user_code, email, password_hash, phone_number, role, status, is_first_login, batch_id, created_on, last_updated) VALUES
(1, 'Admin User', 'ADM001', 'admin@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543210', 'ROLE_ADMIN', 'ACTIVE', false, NULL, NOW(), NOW()),
(2, 'John Instructor', 'INS001', 'john.instructor@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543211', 'ROLE_INSTRUCTOR', 'ACTIVE', false, 1, NOW(), NOW()),
(3, 'Jane Instructor', 'INS002', 'jane.instructor@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543212', 'ROLE_INSTRUCTOR', 'ACTIVE', false, 1, NOW(), NOW()),
(4, 'Alice Student', 'STU001', 'alice.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543213', 'ROLE_STUDENT', 'ACTIVE', false, 1, NOW(), NOW()),
(5, 'Bob Student', 'STU002', 'bob.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543214', 'ROLE_STUDENT', 'ACTIVE', false, 1, NOW(), NOW()),
(6, 'Charlie Student', 'STU003', 'charlie.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543215', 'ROLE_STUDENT', 'ACTIVE', false, 2, NOW(), NOW());

-- Insert test courses
INSERT INTO courses (course_id, course_code, title, description, instructor_id, status, created_on, last_updated) VALUES
(1, 'CS101', 'Introduction to Programming', 'Basic programming concepts using Java', 2, 'ACTIVE', NOW(), NOW()),
(2, 'CS102', 'Data Structures', 'Fundamental data structures and algorithms', 2, 'ACTIVE', NOW(), NOW()),
(3, 'CS201', 'Database Management', 'Relational database concepts and SQL', 3, 'ACTIVE', NOW(), NOW()),
(4, 'CS202', 'Web Development', 'Full stack web development using modern frameworks', 3, 'INACTIVE', NOW(), NOW());

-- Insert course syllabus
INSERT INTO course_syllabus (course_id, module_number, module_title, module_description, estimated_hours) VALUES
(1, 1, 'Java Basics', 'Variables, Data Types, Operators', 10),
(1, 2, 'Control Structures', 'If-else, Loops, Switch', 8),
(1, 3, 'Object Oriented Programming', 'Classes, Objects, Inheritance', 12),
(2, 1, 'Arrays and Strings', 'Array operations, String manipulation', 6),
(2, 2, 'Linked Lists', 'Singly, Doubly linked lists', 8),
(2, 3, 'Stacks and Queues', 'Implementation and applications', 6);

-- Insert course outcomes
INSERT INTO course_outcomes (course_id, outcome_text) VALUES
(1, 'Understand basic programming concepts'),
(1, 'Write simple Java programs'),
(1, 'Apply OOP principles in programming'),
(2, 'Implement various data structures'),
(2, 'Analyze time and space complexity'),
(2, 'Choose appropriate data structure for problems');