package com.oep.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Exam;
import com.oep.entities.ExamQuestions;
import com.oep.entities.ExamViolation;
import com.oep.service.ExamService;
import com.oep.repository.ViolationRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ExamController {
    private final ExamService examService;
    private final ViolationRepository violationRepository;

    @GetMapping("/admin/exams")
    @Operation(description = "Admin access to all exams")
    public ResponseEntity<List<Exam>> getAllExamsAdmin() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/instructor/exams/{instructorId}")
    @Operation(description = "Instructor access to assigned exams")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getInstructorExams(@PathVariable Long instructorId) {
        List<Exam> exams = examService.getExamsByInstructor(instructorId);
        // Map to include course details
        List<Map<String, Object>> response = exams.stream().map(exam -> {
            // Calculate totals from questions
            List<ExamQuestions> questions = examService.getExamQuestions(exam.getId());
            int totalMarks = questions.stream()
                    .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                    .sum();
            
            Map<String, Object> examData = new java.util.HashMap<>();
            examData.put("id", exam.getId());
            examData.put("examTitle", exam.getExamTitle());
            examData.put("scheduledDate", exam.getScheduledDate());
            examData.put("startTime", exam.getStartTime());
            examData.put("endTime", exam.getEndTime());
            examData.put("duration", exam.getDuration());
            examData.put("totalMarks", totalMarks);
            examData.put("passingMarks", exam.getPassingMarks());
            examData.put("status", exam.getStatus());
            examData.put("totalQuestions", questions.size());
            examData.put("resultPublished", exam.getResultPublished());
            examData.put("answerReviewAllowed", exam.getAnswerReviewAllowed());
            examData.put("scorecardReleased", exam.getScorecardReleased());
            
            // Add course details
            if (exam.getCourse() != null) {
                Map<String, Object> courseInfo = new java.util.HashMap<>();
                courseInfo.put("id", exam.getCourse().getId());
                courseInfo.put("title", exam.getCourse().getTitle());
                courseInfo.put("courseCode", exam.getCourse().getCourseCode());
                examData.put("course", courseInfo);
            }
            
            return examData;
        }).collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/exams/{studentId}")
    @Operation(description = "Student access to enrolled exams")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getStudentExams(@PathVariable Long studentId) {
        List<Exam> exams = examService.getExamsByStudent(studentId);
        List<Map<String, Object>> response = exams.stream().map(exam -> {
            // Calculate totals from questions
            List<ExamQuestions> questions = examService.getExamQuestions(exam.getId());
            int totalMarks = questions.stream()
                    .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                    .sum();
            
            Map<String, Object> examData = new java.util.HashMap<>();
            examData.put("id", exam.getId());
            examData.put("examTitle", exam.getExamTitle());
            examData.put("scheduledDate", exam.getScheduledDate());
            examData.put("startTime", exam.getStartTime());
            examData.put("endTime", exam.getEndTime());
            examData.put("duration", exam.getDuration());
            examData.put("totalMarks", totalMarks);
            examData.put("passingMarks", exam.getPassingMarks());
            examData.put("status", exam.getStatus());
            examData.put("totalQuestions", questions.size());
            return examData;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/exams/available/{studentId}")
    @Operation(description = "Discovery for available exams")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getAvailableExams(@PathVariable Long studentId) {
        List<Exam> exams = examService.getExamsByStudent(studentId);
        List<Map<String, Object>> response = exams.stream().map(exam -> {
            // Calculate totals from questions
            List<ExamQuestions> questions = examService.getExamQuestions(exam.getId());
            int totalMarks = questions.stream()
                    .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                    .sum();
            
            Map<String, Object> examData = new java.util.HashMap<>();
            examData.put("id", exam.getId());
            examData.put("examTitle", exam.getExamTitle());
            examData.put("scheduledDate", exam.getScheduledDate());
            examData.put("startTime", exam.getStartTime());
            examData.put("endTime", exam.getEndTime());
            examData.put("duration", exam.getDuration());
            examData.put("totalMarks", totalMarks);
            examData.put("passingMarks", exam.getPassingMarks());
            examData.put("status", exam.getStatus());
            examData.put("totalQuestions", questions.size());
            return examData;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exams/{id}")
    @Operation(description = "Get exam by ID")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getExamById(@PathVariable Long id) {
        Exam exam = examService.getExamById(id);
        
        // Recalculate totals from questions
        List<ExamQuestions> questions = examService.getExamQuestions(id);
        int totalMarks = questions.stream()
                .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                .sum();
        
        // Create response with course details
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", exam.getId());
        response.put("examTitle", exam.getExamTitle());
        response.put("scheduledDate", exam.getScheduledDate());
        response.put("startTime", exam.getStartTime());
        response.put("endTime", exam.getEndTime());
        response.put("duration", exam.getDuration());
        response.put("totalMarks", totalMarks);
        response.put("passingMarks", exam.getPassingMarks());
        response.put("status", exam.getStatus());
        response.put("totalQuestions", questions.size());
        response.put("examPassword", exam.getExamPassword());
        
        // Add course details
        if (exam.getCourse() != null) {
            Map<String, Object> courseInfo = new java.util.HashMap<>();
            courseInfo.put("id", exam.getCourse().getId());
            courseInfo.put("title", exam.getCourse().getTitle());
            courseInfo.put("courseCode", exam.getCourse().getCourseCode());
            response.put("course", courseInfo);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/instructor/exams")
    @Operation(description = "Instructor create exam")
    public ResponseEntity<Exam> createExam(@RequestBody Map<String, Object> payload) {
        Exam exam = new Exam();
        exam.setExamTitle((String) payload.get("examTitle"));
        exam.setScheduledDate(java.time.LocalDate.parse((String) payload.get("scheduledDate")));
        exam.setStartTime(java.time.LocalTime.parse((String) payload.get("startTime")));
        exam.setEndTime(java.time.LocalTime.parse((String) payload.get("endTime")));
        exam.setDuration(((Number) payload.get("duration")).intValue());
        exam.setPassingMarks(((Number) payload.get("passingMarks")).intValue());
        exam.setStatus(com.oep.entities.ExamStatus.valueOf((String) payload.get("status")));
        exam.setExamPassword((String) payload.get("examPassword"));
        
        // Fetch and set Course
        Long courseId = ((Number) payload.get("courseId")).longValue();
        com.oep.entities.Courses course = examService.getCourseById(courseId);
        exam.setCourse(course);
        
        // Fetch and set Instructor
        Long instructorId = ((Number) payload.get("instructorId")).longValue();
        com.oep.entities.User instructor = examService.getUserById(instructorId);
        exam.setInstructorDetails(instructor);
        
        return ResponseEntity.ok(examService.createExam(exam));
    }

    @PutMapping("/instructor/exams/{id}")
    @Operation(description = "Instructor update exam")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        return ResponseEntity.ok(examService.updateExam(id, exam));
    }

    @DeleteMapping({ "/admin/exams/{id}", "/instructor/exams/{id}" })
    @Operation(description = "Delete exam")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/instructor/exams/{examId}/questions/{questionId}")
    @Operation(description = "Add question to exam")
    public ResponseEntity<Void> addQuestionToExam(@PathVariable Long examId, @PathVariable Long questionId) {
        examService.addQuestionToExam(examId, questionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/instructor/exams/{examId}/questions/{questionId}")
    @Operation(description = "Remove question from exam")
    public ResponseEntity<Void> removeQuestionFromExam(@PathVariable Long examId, @PathVariable Long questionId) {
        examService.removeQuestionFromExam(examId, questionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/student/exams/{examId}/report-violation")
    @Operation(description = "Report exam violation")
    public ResponseEntity<?> reportViolation(@PathVariable Long examId, @RequestBody ExamViolation violation) {
        violationRepository.save(violation);
        return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Violation reported"));
    }

    @PostMapping("/student/exams/{examId}/verify-password")
    @Operation(description = "Verify exam password before starting")
    public ResponseEntity<?> verifyPassword(@PathVariable Long examId, @RequestBody Map<String, String> payload) {
        String password = payload.get("password");
        boolean isValid = examService.verifyPassword(examId, password);
        if (isValid) {
            return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Password verified"));
        } else {
            return ResponseEntity.status(401).body(new com.oep.dtos.ApiResponse("failed", "Invalid exam password"));
        }
    }

    @PostMapping("/student/exams/{examId}/submissions")
    @Operation(description = "Handle exam submission (or start check if password provided)")
    public ResponseEntity<?> handleSubmission(@PathVariable Long examId, @RequestBody Map<String, Object> payload) {
        // If password is provided in body, treat as start verification
        if (payload.containsKey("password")) {
            String password = (String) payload.get("password");
            if (examService.verifyPassword(examId, password)) {
                return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Exam access granted"));
            } else {
                return ResponseEntity.status(401).body(new com.oep.dtos.ApiResponse("failed", "Invalid exam password"));
            }
        }
        
        // Handle actual submission
        if (payload.containsKey("answers") && payload.containsKey("studentId")) {
             Long studentId = Long.parseLong(payload.get("studentId").toString());
             @SuppressWarnings("unchecked")
             Map<String, Object> rawAnswers = (Map<String, Object>) payload.get("answers");
             
             Map<Long, String> answers = new java.util.HashMap<>();
             for (Map.Entry<String, Object> entry : rawAnswers.entrySet()) {
                 try {
                    answers.put(Long.parseLong(entry.getKey()), entry.getValue().toString());
                 } catch (NumberFormatException e) {
                     // ignore invalid keys
                 }
             }
             
             com.oep.entities.ExamResults result = examService.submitExam(examId, studentId, answers);
             return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Exam submitted successfully"));
        }

        return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Submission received"));
    }

    @GetMapping("/instructor/exams/{examId}/questions")
    @Operation(description = "Get exam questions for instructor")
    public ResponseEntity<List<ExamQuestions>> getExamQuestions(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getExamQuestions(examId));
    }

    @GetMapping("/student/exams/{examId}/questions")
    @Operation(description = "Get exam questions for student with shuffled matching pairs")
    public ResponseEntity<?> getExamQuestionsForStudent(@PathVariable Long examId) {
        List<ExamQuestions> examQuestions = examService.getExamQuestions(examId);
        
        // Shuffle matching pairs for each MATCHING type question
        List<Map<String, Object>> shuffledQuestions = examQuestions.stream().map(eq -> {
            Map<String, Object> questionData = new java.util.HashMap<>();
            questionData.put("id", eq.getQuestion().getId());
            questionData.put("questionText", eq.getQuestion().getQuestionText());
            questionData.put("type", eq.getQuestion().getType());
            questionData.put("marksAllotted", eq.getQuestion().getMarksAllotted());
            
            // Handle different question types
            if (eq.getQuestion().getType() == com.oep.entities.QuestionType.MATCHING) {
                Map<String, String> originalPairs = eq.getQuestion().getMatchingPairs();
                List<String> leftItems = new java.util.ArrayList<>(originalPairs.keySet());
                List<String> rightItems = new java.util.ArrayList<>(originalPairs.values());
                
                // Shuffle both lists
                java.util.Collections.shuffle(leftItems);
                java.util.Collections.shuffle(rightItems);
                
                questionData.put("leftItems", leftItems);
                questionData.put("rightItems", rightItems);
                questionData.put("options", new java.util.ArrayList<>());
            } else if (eq.getQuestion().getType() == com.oep.entities.QuestionType.TRUE_FALSE) {
                // For TRUE_FALSE, ensure options are set
                List<String> options = eq.getQuestion().getOptions();
                if (options == null || options.isEmpty()) {
                    options = java.util.Arrays.asList("True", "False");
                }
                questionData.put("options", options);
            } else {
                // For MCQ, MULTIPLE_SELECT, etc.
                questionData.put("options", eq.getQuestion().getOptions());
            }
            
            return questionData;
        }).collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(shuffledQuestions);
    }

    @GetMapping("/exams/{examId}/live-stats")
    @Operation(description = "Get live exam statistics")
    public ResponseEntity<?> getExamLiveStats(@PathVariable Long examId) {
        // Implementation will be added when the service method is available
        return ResponseEntity.ok(java.util.Collections.emptyMap());
    }

    @GetMapping("/exams/{examId}/live-students")
    @Operation(description = "Get live exam students")
    public ResponseEntity<?> getExamLiveStudents(@PathVariable Long examId) {
        // Implementation will be added when the service method is available
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @GetMapping("/instructor/exams/{examId}/results")
    @Operation(description = "Get exam results for instructor")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getExamResults(@PathVariable Long examId) {
        List<com.oep.entities.ExamResults> results = examService.getResultsByExam(examId);
        List<Map<String, Object>> response = results.stream().map(result -> {
            Map<String, Object> data = new java.util.HashMap<>();
            data.put("id", result.getId());
            data.put("totalScore", result.getTotalScore());
            data.put("totalMarks", result.getTotalMarks());
            data.put("status", result.getStatus());
            data.put("isEvaluated", result.getIsEvaluated());
            data.put("submittedAt", result.getSubmittedAt());
            
            if (result.getStudent() != null) {
                Map<String, Object> studentData = new java.util.HashMap<>();
                studentData.put("id", result.getStudent().getId());
                studentData.put("userName", result.getStudent().getUserName());
                studentData.put("userCode", result.getStudent().getUserCode());
                data.put("student", studentData);
            }
            
            return data;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/instructor/exams/{examId}/settings")
    @Operation(description = "Update exam settings")
    public ResponseEntity<?> updateExamSettings(@PathVariable Long examId, @RequestBody Map<String, Object> settings) {
        Exam exam = examService.getExamById(examId);
        
        if (settings.containsKey("resultPublished")) {
            exam.setResultPublished((Boolean) settings.get("resultPublished"));
        }
        if (settings.containsKey("answerReviewAllowed")) {
            exam.setAnswerReviewAllowed((Boolean) settings.get("answerReviewAllowed"));
        }
        if (settings.containsKey("scorecardReleased")) {
            exam.setScorecardReleased((Boolean) settings.get("scorecardReleased"));
        }
        
        examService.updateExam(examId, exam);
        return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Settings updated"));
    }
}
