# Fix: Total Marks Calculation from Questions

## Problem
The exam was showing "Total Marks: 0" even though questions were assigned to the exam. The total marks should be automatically calculated from the marks assigned to each question.

## Solution
Implemented automatic calculation of total marks and total questions in the backend:

### Changes Made

#### 1. ExamServiceImpl.java
- Added `updateExamTotals(Long examId)` private method that:
  - Fetches all questions for the exam
  - Sums up the marks from all questions
  - Updates the exam's totalMarks and totalQuestions fields
  
- Modified `addQuestionToExam()` to call `updateExamTotals()` after adding a question
- Modified `removeQuestionFromExam()` to call `updateExamTotals()` after removing a question

#### 2. ExamController.java
Updated all exam retrieval endpoints to calculate totals in real-time:

- `GET /exams/{id}` - Calculates total marks from questions before returning
- `GET /instructor/exams/{instructorId}` - Calculates totals for each exam
- `GET /student/exams/{studentId}` - Calculates totals for each exam
- `GET /student/exams/available/{studentId}` - Calculates totals for each exam

### How It Works

**When questions are added/removed:**
1. Question is added/removed from exam_questions table
2. `updateExamTotals()` is automatically called
3. All questions for the exam are fetched
4. Total marks = sum of all question marks
5. Total questions = count of questions
6. Exam entity is updated in database

**When exam details are fetched:**
1. Exam questions are retrieved
2. Total marks is calculated: `sum(question.marksAllotted)`
3. Total questions is calculated: `count(questions)`
4. Calculated values are returned in the response

### Benefits
- ✅ Total marks always accurate and up-to-date
- ✅ Automatic calculation when questions are added/removed
- ✅ Real-time calculation when fetching exam details
- ✅ No manual entry of total marks needed
- ✅ Prevents inconsistencies between stored and actual totals

### Testing
1. Restart the Spring Boot application
2. Add questions to an exam
3. View exam details - total marks should reflect sum of question marks
4. Remove questions from exam
5. Total marks should automatically decrease

### Example
If an exam has:
- Question 1: 5 marks
- Question 2: 10 marks
- Question 3: 5 marks

Total Marks will automatically be: 20
Total Questions will be: 3
