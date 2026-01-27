-- Update users with valid password: admin@123
-- BCrypt hash for admin@123: $2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu

USE student_instructor_service_db;

UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'admin@oep.com';
UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'john.instructor@oep.com';
UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'jane.instructor@oep.com';
UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'alice.student@oep.com';
UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'bob.student@oep.com';
UPDATE users SET password_hash = '$2a$10$8K1p/a0dL2LkUnfEkIJ.i.vCXMRCkYq1oxhJU8m1qGEqO9WzP7OYu' WHERE email = 'charlie.student@oep.com';

SELECT 'Passwords updated successfully for all users. Password: admin@123' as Result;