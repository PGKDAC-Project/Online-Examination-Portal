package com.oep.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Question;
import com.oep.service.QuestionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/instructor/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Question>> getQuestionsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(questionService.getQuestionsByCourse(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.createQuestion(question));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/tags")
    public ResponseEntity<Question> updateQuestionTags(@PathVariable Long id, @RequestBody java.util.Map<String, java.util.List<String>> tags) {
        // Implementation will be added when the service method is available
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("/import")
    public ResponseEntity<List<Question>> importQuestions(@RequestPart("file") org.springframework.web.multipart.MultipartFile file) {
        // Implementation will be added when the service method is available
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }
}
