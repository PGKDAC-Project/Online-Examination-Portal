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
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getStudentResults(@PathVariable Long studentId) {
        List<ExamResults> results = resultService.getResultsByStudent(studentId);
        List<java.util.Map<String, Object>> response = results.stream().map(result -> {
            java.util.Map<String, Object> dto = new java.util.HashMap<>();
            dto.put("id", result.getId());
            dto.put("examId", result.getExam().getId());
            dto.put("examName", result.getExam().getExamTitle());
            dto.put("courseCode", result.getExam().getCourse() != null ? result.getExam().getCourse().getCourseCode() : "N/A");
            dto.put("attemptedOn", result.getSubmittedAt());
            dto.put("score", result.getTotalScore());
            dto.put("totalMarks", result.getTotalMarks());
            dto.put("status", result.getStatus());
            dto.put("result", result.getStatus());
            dto.put("resultEnabled", result.getIsEvaluated());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/results/{id}")
    @Operation(description = "Get result by ID")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getResultById(@PathVariable Long id) {
        ExamResults result = resultService.getResultById(id);
        java.util.Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("id", result.getId());
        dto.put("examName", result.getExam().getExamTitle());
        dto.put("score", result.getTotalScore());
        dto.put("totalMarks", result.getTotalMarks());
        dto.put("status", result.getStatus());
        dto.put("resultPublished", result.getIsEvaluated());
        dto.put("percentage", result.getTotalMarks() > 0 ? (result.getTotalScore() * 100.0 / result.getTotalMarks()) : 0);
        dto.put("correct", 0); // TODO: Calculate from student answers
        dto.put("wrong", 0);
        dto.put("unattempted", 0);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/results/{id}/detailed")
    @Operation(description = "Get detailed result with questions and answers")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<?> getDetailedResult(@PathVariable Long id) {
        ExamResults result = resultService.getResultById(id);
        
        // Get all student answers for this result
        List<com.oep.entities.StudentAnswer> studentAnswers = resultService.getStudentAnswersByResultId(id);
        
        // Get all exam questions
        List<com.oep.entities.ExamQuestions> examQuestions = resultService.getExamQuestions(result.getExam().getId());
        
        // Build question details
        List<java.util.Map<String, Object>> questionDetails = new java.util.ArrayList<>();
        int correct = 0, wrong = 0, unattempted = 0;
        
        for (com.oep.entities.ExamQuestions eq : examQuestions) {
            com.oep.entities.Question question = eq.getQuestion();
            
            // Find student answer for this question
            com.oep.entities.StudentAnswer studentAnswer = studentAnswers.stream()
                .filter(sa -> sa.getQuestion().getId().equals(question.getId()))
                .findFirst()
                .orElse(null);
            
            java.util.Map<String, Object> qDetail = new java.util.HashMap<>();
            qDetail.put("id", question.getId());
            qDetail.put("text", question.getQuestionText());
            qDetail.put("type", question.getType());
            qDetail.put("marks", question.getMarksAllotted());
            
            if (studentAnswer != null) {
                qDetail.put("selected", studentAnswer.getSelectedOptionJson());
                qDetail.put("marksAwarded", studentAnswer.getMarksAwarded());
                qDetail.put("isCorrect", studentAnswer.getIsCorrect());
                
                if (studentAnswer.getIsCorrect() != null && studentAnswer.getIsCorrect()) {
                    qDetail.put("status", "Correct");
                    correct++;
                } else if (studentAnswer.getIsCorrect() != null && !studentAnswer.getIsCorrect()) {
                    qDetail.put("status", "Wrong");
                    wrong++;
                } else {
                    qDetail.put("status", "Unattempted");
                    unattempted++;
                }
            } else {
                qDetail.put("selected", null);
                qDetail.put("marksAwarded", 0);
                qDetail.put("isCorrect", false);
                qDetail.put("status", "Unattempted");
                unattempted++;
            }
            
            // Add correct answer if review is allowed
            if (result.getExam().getAnswerReviewAllowed() != null && result.getExam().getAnswerReviewAllowed()) {
                qDetail.put("correctAnswers", question.getCorrectAnswers());
            }
            
            questionDetails.add(qDetail);
        }
        
        java.util.Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("id", result.getId());
        dto.put("examName", result.getExam().getExamTitle());
        dto.put("score", result.getTotalScore());
        dto.put("totalMarks", result.getTotalMarks());
        dto.put("status", result.getStatus());
        dto.put("resultPublished", result.getIsEvaluated());
        dto.put("percentage", result.getTotalMarks() > 0 ? (result.getTotalScore() * 100.0 / result.getTotalMarks()) : 0);
        dto.put("correct", correct);
        dto.put("wrong", wrong);
        dto.put("unattempted", unattempted);
        dto.put("questions", questionDetails);
        
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/student/results/submit")
    @Operation(description = "Student submit exam result")
    public ResponseEntity<ExamResults> submitResult(@RequestBody ExamResults result) {
        return ResponseEntity.ok(resultService.submitResult(result));
    }
}
