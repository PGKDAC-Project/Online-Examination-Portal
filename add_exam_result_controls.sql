-- Add result control columns to exams table
USE student_instructor_service_db;

-- Add columns (MySQL doesn't support IF NOT EXISTS for columns)
ALTER TABLE exams 
ADD COLUMN result_published BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE exams 
ADD COLUMN answer_review_allowed BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE exams 
ADD COLUMN scorecard_released BOOLEAN NOT NULL DEFAULT FALSE;

-- Verify the columns were added
DESCRIBE exams;
