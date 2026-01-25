package com.oep.controller;

import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class AdminStubController {

    // Users
    @GetMapping("/users")
    public ResponseEntity<List<?>> getUsers() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser() {
        return ResponseEntity.ok(Collections.singletonMap("message", "User creation stub successful"));
    }

    // Batches
    @GetMapping("/batches")
    public ResponseEntity<List<?>> getBatches() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    // Courses
    @GetMapping("/courses")
    public ResponseEntity<List<?>> getCourses() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PatchMapping("/courses/{id}/status")
    public ResponseEntity<?> updateCourseStatus(@PathVariable Long id) {
        return ResponseEntity.ok(Collections.singletonMap("message", "Status update stub successful"));
    }

    // Exams
    @GetMapping("/exams")
    public ResponseEntity<List<?>> getExams() {
        return ResponseEntity.ok(Collections.emptyList());
    }

    // Logs
    @GetMapping("/logs")
    public ResponseEntity<List<?>> getLogs() {
        return ResponseEntity.ok(Collections.emptyList());
    }
}
