USE student_instructor_service_db;
UPDATE users SET password_hash = '$2a$10$byP/ZkkC2m6cdMq3xcg53uHwRBuclXHFZ70LWeRmemubbCittLDAa' WHERE email = 'admin@oep.com';
