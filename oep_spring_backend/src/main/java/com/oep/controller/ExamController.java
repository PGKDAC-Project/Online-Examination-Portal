package com.oep.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Exam;
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
        // Handle actual submission logic here if needed, or redirect to results
        return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Submission received"));
    }
}
