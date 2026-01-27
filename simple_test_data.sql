-- Simplified test data for Spring Boot Service Database

USE student_instructor_service_db;

-- Insert test users
INSERT INTO users (user_name, user_code, email, password_hash, phone_number, role, status, is_first_login, batch_id, created_on, last_updated) VALUES
('Admin User', 'ADM001', 'admin@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543210', 'ROLE_ADMIN', 'ACTIVE', false, NULL, NOW(), NOW()),
('John Instructor', 'INS001', 'john.instructor@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543211', 'ROLE_INSTRUCTOR', 'ACTIVE', false, 1, NOW(), NOW()),
('Jane Instructor', 'INS002', 'jane.instructor@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543212', 'ROLE_INSTRUCTOR', 'ACTIVE', false, 1, NOW(), NOW()),
('Alice Student', 'STU001', 'alice.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543213', 'ROLE_STUDENT', 'ACTIVE', false, 1, NOW(), NOW()),
('Bob Student', 'STU002', 'bob.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543214', 'ROLE_STUDENT', 'ACTIVE', false, 1, NOW(), NOW()),
('Charlie Student', 'STU003', 'charlie.student@oep.com', '$2a$10$N.zmdr9k7uOCQb97.AnUu.Nv.QjYLR3h8jrJb2hVkfvhZZbdDeqze', '9876543215', 'ROLE_STUDENT', 'ACTIVE', false, 2, NOW(), NOW());

-- Insert test courses
INSERT INTO courses (course_code, title, description, instructor_id, status, created_on, last_updated) VALUES
('CS101', 'Introduction to Programming', 'Basic programming concepts using Java', 2, 'ACTIVE', NOW(), NOW()),
('CS102', 'Data Structures', 'Fundamental data structures and algorithms', 2, 'ACTIVE', NOW(), NOW()),
('CS201', 'Database Management', 'Relational database concepts and SQL', 3, 'ACTIVE', NOW(), NOW()),
('CS202', 'Web Development', 'Full stack web development using modern frameworks', 3, 'INACTIVE', NOW(), NOW());