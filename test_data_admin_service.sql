-- Test data for Admin Service Database (admin_service_db)

USE admin_service_db;

-- Insert test batches
INSERT INTO batches (batch_id, batch_name, description, start_date, end_date) VALUES
(1, 'PG-DAC March 2024', 'Post Graduate Diploma in Advanced Computing - March 2024 batch', '2024-03-01', '2024-08-31'),
(2, 'PG-DAC September 2024', 'Post Graduate Diploma in Advanced Computing - September 2024 batch', '2024-09-01', '2025-02-28'),
(3, 'PG-DBDA March 2024', 'Post Graduate Diploma in Big Data Analytics - March 2024 batch', '2024-03-01', '2024-08-31');

-- Insert test announcements
INSERT INTO announcements (announcement_id, title, description, created_by_email, created_by_role, target_role, is_active, expires_at, created_at) VALUES
(1, 'Welcome to Online Examination Portal', 'Welcome to the new online examination system. Please update your profile and change your default password.', 'admin@oep.com', 0, 2, 1, '2024-12-31 23:59:59', NOW()),
(2, 'Exam Schedule Released', 'The examination schedule for mid-term exams has been released. Please check your dashboard for details.', 'admin@oep.com', 0, 2, 1, '2024-06-30 23:59:59', NOW()),
(3, 'System Maintenance Notice', 'The system will be under maintenance on Sunday from 2 AM to 6 AM. Please plan accordingly.', 'admin@oep.com', 0, 1, 1, '2024-03-15 23:59:59', NOW()),
(4, 'New Course Added', 'A new course on Machine Learning has been added to the curriculum. Enrollment starts next week.', 'john.instructor@oep.com', 1, 2, 1, '2024-04-30 23:59:59', NOW());

-- Insert test system settings
INSERT INTO system_settings (id, setting_key, setting_value, description, created_at, updated_at) VALUES
(1, 'exam_duration_default', '120', 'Default exam duration in minutes', NOW(), NOW()),
(2, 'max_attempts_per_exam', '3', 'Maximum number of attempts allowed per exam', NOW(), NOW()),
(3, 'auto_submit_enabled', 'true', 'Enable automatic submission when time expires', NOW(), NOW()),
(4, 'result_publish_delay', '24', 'Hours to wait before publishing results', NOW(), NOW()),
(5, 'email_notifications_enabled', 'true', 'Enable email notifications for important events', NOW(), NOW());

-- Insert test audit logs
INSERT INTO audit_logs (id, service_name, user_email, role, action, details, timestamp) VALUES
(1, 0, 'admin@oep.com', 0, 0, 'Admin user logged into the system', NOW()),
(2, 1, 'admin@oep.com', 0, 1, 'Created new user: john.instructor@oep.com', NOW()),
(3, 2, 'admin@oep.com', 0, 2, 'Created new course: Introduction to Programming', NOW()),
(4, 0, 'john.instructor@oep.com', 1, 0, 'Instructor logged into the system', NOW()),
(5, 1, 'admin@oep.com', 0, 3, 'Updated user status for alice.student@oep.com', NOW());

