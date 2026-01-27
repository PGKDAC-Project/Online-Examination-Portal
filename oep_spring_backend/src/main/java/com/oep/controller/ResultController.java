package com.oep.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.ExamResults;
import com.oep.service.ResultService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ResultController {
    private final ResultService resultService;

    @GetMapping("/admin/results")
    @Operation(description = "Admin access to all results")
    public ResponseEntity<List<ExamResults>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/instructor/results/exam/{examId}")
    @Operation(description = "Instructor access to exam results")
    public ResponseEntity<List<ExamResults>> getResultsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getResultsByExam(examId));
    }

    @GetMapping("/student/results/{studentId}")
    @Operation(description = "Student access to personal results")
    public ResponseEntity<List<ExamResults>> getStudentResults(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/results/{id}")
    @Operation(description = "Get result by ID")
    public ResponseEntity<ExamResults> getResultById(@PathVariable Long id) {
        return ResponseEntity.ok(resultService.getResultById(id));
    }

    @PostMapping("/student/results/submit")
    @Operation(description = "Student submit exam result")
    public ResponseEntity<ExamResults> submitResult(@RequestBody ExamResults result) {
        return ResponseEntity.ok(resultService.submitResult(result));
    }
}
