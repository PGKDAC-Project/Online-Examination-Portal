-- Updated test data for Admin Service Database (admin_service_db)

USE admin_service_db;

-- Insert test batches (no description column in actual table)
INSERT INTO batches (batch_name, start_date, end_date) VALUES
('PG-DAC March 2024', '2024-03-01', '2024-08-31'),
('PG-DAC September 2024', '2024-09-01', '2025-02-28'),
('PG-DBDA March 2024', '2024-03-01', '2024-08-31');

-- Insert test announcements (using 'message' instead of 'description')
INSERT INTO announcements (title, message, created_by_email, created_by_role, target_role, is_active, expires_at, created_at) VALUES
('Welcome to Online Examination Portal', 'Welcome to the new online examination system. Please update your profile and change your default password.', 'admin@oep.com', 'ROLE_ADMIN', 'ROLE_STUDENT', 1, '2024-12-31 23:59:59', NOW()),
('Exam Schedule Released', 'The examination schedule for mid-term exams has been released. Please check your dashboard for details.', 'admin@oep.com', 'ROLE_ADMIN', 'ROLE_STUDENT', 1, '2024-06-30 23:59:59', NOW()),
('System Maintenance Notice', 'The system will be under maintenance on Sunday from 2 AM to 6 AM. Please plan accordingly.', 'admin@oep.com', 'ROLE_ADMIN', 'ROLE_INSTRUCTOR', 1, '2024-03-15 23:59:59', NOW()),
('New Course Added', 'A new course on Machine Learning has been added to the curriculum. Enrollment starts next week.', 'john.instructor@oep.com', 'ROLE_INSTRUCTOR', 'ROLE_STUDENT', 1, '2024-04-30 23:59:59', NOW());

-- Insert test system settings
INSERT INTO system_settings (maintenance_mode, tab_switch_detection, fullscreen_enforcement, exam_auto_submit, last_updated) VALUES
(false, true, true, true, NOW());

-- Insert test audit logs
INSERT INTO audit_logs (service_name, action_name, user_email, user_role, details, created_at) VALUES
('USER_SERVICE', 'LOGIN', 'admin@oep.com', 'ROLE_ADMIN', 'Admin user logged into the system', NOW()),
('USER_SERVICE', 'CREATE_USER', 'admin@oep.com', 'ROLE_ADMIN', 'Created new user: john.instructor@oep.com', NOW()),
('COURSE_SERVICE', 'CREATE_COURSE', 'admin@oep.com', 'ROLE_ADMIN', 'Created new course: Introduction to Programming', NOW()),
('USER_SERVICE', 'LOGIN', 'john.instructor@oep.com', 'ROLE_INSTRUCTOR', 'Instructor logged into the system', NOW()),
('USER_SERVICE', 'UPDATE_USER', 'admin@oep.com', 'ROLE_ADMIN', 'Updated user status for alice.student@oep.com', NOW());