-- Comprehensive fix for question options
USE student_instructor_service_db;

-- Step 1: Remove all True/False options from non-TRUE_FALSE questions
DELETE qo FROM question_options qo
INNER JOIN questions q ON qo.question_id = q.question_id
WHERE q.type != 'TRUE_FALSE' 
AND qo.option_text IN ('True', 'False');

-- Step 2: Remove empty or null options
DELETE FROM question_options 
WHERE option_text IS NULL OR option_text = '' OR TRIM(option_text) = '';

-- Step 3: Check what's left
SELECT q.question_id, q.question_code, q.question_text, q.type, qo.option_text
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
ORDER BY q.question_id, qo.option_text;

-- Step 4: For TRUE_FALSE questions without options, add them
INSERT INTO question_options (question_id, option_text)
SELECT q.question_id, 'True'
FROM questions q
WHERE q.type = 'TRUE_FALSE'
AND NOT EXISTS (
    SELECT 1 FROM question_options 
    WHERE question_id = q.question_id AND option_text = 'True'
);

INSERT INTO question_options (question_id, option_text)
SELECT q.question_id, 'False'
FROM questions q
WHERE q.type = 'TRUE_FALSE'
AND NOT EXISTS (
    SELECT 1 FROM question_options 
    WHERE question_id = q.question_id AND option_text = 'False'
);

-- Step 5: Verify final state
SELECT q.question_id, q.question_code, q.type, COUNT(qo.option_text) as option_count
FROM questions q
LEFT JOIN question_options qo ON q.question_id = qo.question_id
GROUP BY q.question_id, q.question_code, q.type
ORDER BY q.question_id;
