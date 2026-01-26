package com.oep.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Courses;
import com.oep.service.CourseService;
import com.oep.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
public class CourseController {
	private final CourseService courseService;
	private final EnrollmentService enrollmentService;

	@GetMapping("/admin/courses")
	@Operation(description = "Admin access to all courses")
	public ResponseEntity<List<Courses>> getAllCoursesAdmin() {
		return ResponseEntity.ok(courseService.getAllCourses());
	}

	@GetMapping("/instructor/courses/{instructorId}")
	@Operation(description = "Instructor access to assigned courses")
	public ResponseEntity<List<Courses>> getInstructorCourses(@PathVariable Long instructorId) {
		return ResponseEntity.ok(courseService.getCoursesByInstructor(instructorId));
	}

	@GetMapping("/student/courses/{studentId}")
	@Operation(description = "Student access to enrolled courses")
	public ResponseEntity<List<Courses>> getStudentCourses(@PathVariable Long studentId) {
		return ResponseEntity.ok(courseService.getCoursesByStudent(studentId));
	}

	@GetMapping("/student/courses/available/{studentId}")
	@Operation(description = "Get available courses for student")
	public ResponseEntity<List<Courses>> getAvailableCourses(@PathVariable Long studentId) {
		return ResponseEntity.ok(enrollmentService.getAvailableCourses(studentId));
	}

	@PostMapping("/student/courses/{courseId}/enroll/{studentId}")
	@Operation(description = "Enroll student in course")
	public ResponseEntity<?> enrollCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
		enrollmentService.enrollStudent(studentId, courseId);
		return ResponseEntity.ok(new com.oep.dtos.ApiResponse("success", "Enrolled successfully"));
	}

	@GetMapping("/courses/{id}")
	@Operation(description = "Get course by ID")
	public ResponseEntity<Courses> getCourseById(@PathVariable Long id) {
		return ResponseEntity.ok(courseService.getCourseById(id));
	}

	@PostMapping("/admin/courses")
	@Operation(description = "Admin create course")
	public ResponseEntity<Courses> createCourse(@RequestBody Courses course) {
		return ResponseEntity.ok(courseService.createCourse(course));
	}

	@PutMapping("/admin/courses/{id}")
	@Operation(description = "Admin update course")
	public ResponseEntity<Courses> updateCourse(@PathVariable Long id, @RequestBody Courses course) {
		return ResponseEntity.ok(courseService.updateCourse(id, course));
	}

	@DeleteMapping("/admin/courses/{id}")
	@Operation(description = "Admin delete course")
	public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
		courseService.deleteCourse(id);
		return ResponseEntity.noContent().build();
	}
}
