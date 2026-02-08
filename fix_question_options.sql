-- Fix missing options for questions
USE student_instructor_service_db;

-- First, check which questions have no options
SELECT q.question_id, q.question_text, q.type 
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
WHERE qo.question_id IS NULL;

-- For TRUE_FALSE questions, add True/False options
-- Replace question_id with actual IDs from your database
INSERT INTO question_options (question_id, option_text) 
SELECT q.question_id, 'True'
FROM questions q
WHERE q.type = 'TRUE_FALSE'
AND NOT EXISTS (SELECT 1 FROM question_options WHERE question_id = q.question_id);

INSERT INTO question_options (question_id, option_text) 
SELECT q.question_id, 'False'
FROM questions q
WHERE q.type = 'TRUE_FALSE'
AND NOT EXISTS (SELECT 1 FROM question_options WHERE question_id = q.question_id AND option_text = 'False');

-- Verify the fix
SELECT q.question_id, q.question_text, q.type, qo.option_text
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
ORDER BY q.question_id, qo.option_text;
