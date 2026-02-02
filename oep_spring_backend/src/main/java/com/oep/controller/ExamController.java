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
    public ResponseEntity<List<Exam>> getInstructorExams(@PathVariable Long instructorId) {
        return ResponseEntity.ok(examService.getExamsByInstructor(instructorId));
    }

    @GetMapping("/student/exams/{studentId}")
    @Operation(description = "Student access to enrolled exams")
    public ResponseEntity<List<Exam>> getStudentExams(@PathVariable Long studentId) {
        return ResponseEntity.ok(examService.getExamsByStudent(studentId));
    }

    @GetMapping("/student/exams/available/{studentId}")
    @Operation(description = "Discovery for available exams")
    public ResponseEntity<List<Exam>> getAvailableExams(@PathVariable Long studentId) {
        return ResponseEntity.ok(examService.getExamsByStudent(studentId));
    }

    @GetMapping("/exams/{id}")
    @Operation(description = "Get exam by ID")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PostMapping("/instructor/exams")
    @Operation(description = "Instructor create exam")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
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
}
