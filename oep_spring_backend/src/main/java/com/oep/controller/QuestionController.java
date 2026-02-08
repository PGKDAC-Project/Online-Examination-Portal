package com.oep.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Question;
import com.oep.entities.Courses;
import com.oep.service.QuestionService;
import com.oep.repository.CourseRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/instructor/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;
    private final CourseRepository courseRepository;

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
    public ResponseEntity<Question> createQuestion(@RequestBody java.util.Map<String, Object> payload) {
        Question question = new Question();
        question.setQuestionText((String) payload.get("questionText"));
        String type = (String) payload.get("type");
        question.setType(com.oep.entities.QuestionType.valueOf(type));
        question.setLevel(com.oep.entities.Level.valueOf((String) payload.get("level")));
        question.setMarksAllotted(((Number) payload.get("marksAllotted")).intValue());
        
        Long courseId = ((Number) payload.get("courseId")).longValue();
        Courses course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        question.setCourse(course);
        
        if (payload.containsKey("options")) {
            question.setOptions((List<String>) payload.get("options"));
        }
        if (payload.containsKey("correctAnswer")) {
            question.getCorrectAnswers().add((String) payload.get("correctAnswer"));
        }
        if (payload.containsKey("correctAnswers")) {
            question.getCorrectAnswers().addAll((List<String>) payload.get("correctAnswers"));
        }
        if ("MATCHING".equals(type) && payload.containsKey("matchingPairs")) {
            question.setMatchingPairs((java.util.Map<String, String>) payload.get("matchingPairs"));
        }
        
        question.setQuestionCode("Q" + System.currentTimeMillis());
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
