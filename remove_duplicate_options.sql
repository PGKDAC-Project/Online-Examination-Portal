-- Remove duplicate options from question_options table
USE student_instructor_service_db;

-- Step 1: Find duplicates
SELECT question_id, option_text, COUNT(*) as count
FROM question_options
GROUP BY question_id, option_text
HAVING COUNT(*) > 1;

-- Step 2: Delete duplicates, keeping only one
DELETE t1 FROM question_options t1
INNER JOIN question_options t2 
WHERE t1.question_id = t2.question_id 
AND t1.option_text = t2.option_text
AND t1.question_id < t2.question_id;

-- Step 3: Verify no duplicates remain
SELECT question_id, option_text, COUNT(*) as count
FROM question_options
GROUP BY question_id, option_text
HAVING COUNT(*) > 1;

-- Step 4: View all options per question
SELECT q.question_id, q.question_text, qo.option_text
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
ORDER BY q.question_id, qo.option_text;
