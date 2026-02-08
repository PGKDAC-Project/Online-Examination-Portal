package com.oep.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.oep.entities.Courses;
import com.oep.service.CourseService;
import com.oep.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.oep.dtos.CourseRequestDto;
import com.oep.dtos.CourseResponseDto;

import java.util.Map;
import com.oep.dtos.ApiResponse;

@RestController
@Validated
@RequiredArgsConstructor
public class CourseController {
	private final CourseService courseService;
	private final EnrollmentService enrollmentService;
	private final com.oep.repository.CourseRepository courseRepository;

	@GetMapping("/admin/courses")
	@Operation(description = "Admin access to all courses")
	public ResponseEntity<List<CourseResponseDto>> getAllCoursesAdmin() {
		return ResponseEntity.ok(courseService.getAllCoursesDto());
	}
	
	@GetMapping("/admin/courses/{id}")
	@Operation(description = "Admin get course by ID")
	public ResponseEntity<CourseResponseDto> getAdminCourseById(@PathVariable Long id) {
		Courses course = courseService.getCourseById(id);
		return ResponseEntity.ok(courseService.mapToDto(course));
	}



	@GetMapping("/instructor/courses/{instructorId}")
	@Operation(description = "Instructor access to assigned courses")
	public ResponseEntity<List<CourseResponseDto>> getInstructorCourses(@PathVariable Long instructorId) {
		List<Courses> courses = courseService.getCoursesByInstructor(instructorId);
		List<CourseResponseDto> dtos = courses.stream()
				.map(courseService::mapToDto)
				.collect(java.util.stream.Collectors.toList());
		return ResponseEntity.ok(dtos);
	}

	@GetMapping("/student/courses/{studentId}")
	@Operation(description = "Student access to enrolled courses")
	public ResponseEntity<List<CourseResponseDto>> getStudentCourses(@PathVariable Long studentId) {
		List<Courses> courses = courseService.getCoursesByStudent(studentId);
		List<CourseResponseDto> dtos = courses.stream()
				.map(courseService::mapToDto)
				.collect(java.util.stream.Collectors.toList());
		return ResponseEntity.ok(dtos);
	}

	@GetMapping("/student/courses/available/{studentId}")
	@Operation(description = "Get available courses for student")
	public ResponseEntity<List<CourseResponseDto>> getAvailableCourses(@PathVariable Long studentId) {
		List<Courses> courses = enrollmentService.getAvailableCourses(studentId);
		List<CourseResponseDto> dtos = courses.stream()
				.map(courseService::mapToDto)
				.collect(java.util.stream.Collectors.toList());
		return ResponseEntity.ok(dtos);
	}

	@PostMapping("/student/courses/{courseId}/enroll/{studentId}")
	@Operation(description = "Enroll student in course")
	public ResponseEntity<?> enrollCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
		enrollmentService.enrollStudent(studentId, courseId);
		return ResponseEntity.ok(new ApiResponse("success", "Enrolled successfully"));
	}

	@GetMapping("/courses/{id}")
	@Operation(description = "Get course by ID")
	public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable Long id) {
		Courses course = courseService.getCourseById(id);
		return ResponseEntity.ok(courseService.mapToDto(course));
	}

	@PostMapping("/admin/courses")
	@Operation(description = "Admin create course")
	public ResponseEntity<CourseResponseDto> createCourse(@RequestBody @Valid CourseRequestDto course) {
		Courses createdCourse = courseService.createCourse(course);
		return ResponseEntity.ok(courseService.mapToDto(createdCourse));
	}

	@PutMapping("/admin/courses/{id}")
	@Operation(description = "Admin update course")
	public ResponseEntity<CourseResponseDto> updateCourse(@PathVariable Long id, @RequestBody @Valid CourseRequestDto course) {
		Courses updatedCourse = courseService.updateCourse(id, course);
		return ResponseEntity.ok(courseService.mapToDto(updatedCourse));
	}

	@PatchMapping("/admin/courses/{id}/status")
	@Operation(description = "Admin update course status")
	public ResponseEntity<?> updateCourseStatus(@PathVariable Long id,
			@RequestBody Map<String, String> payload) {
		String status = payload.get("status");
		courseService.updateCourseStatus(id, status);
		return ResponseEntity.ok(new ApiResponse("success", "Status updated successfully"));
	}

	@DeleteMapping("/admin/courses/{id}")
	@Operation(description = "Admin delete course")
	public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
		courseService.deleteCourse(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/courses/{courseId}/enrollments")
	@Operation(description = "Get course enrollments")
	public ResponseEntity<List<?>> getCourseEnrollments(@PathVariable Long courseId) {
		// Implementation will be added when the service method is available
		return ResponseEntity.ok(java.util.Collections.emptyList());
	}

	@GetMapping("/courses/{courseId}/syllabus")
	@Operation(description = "Get course syllabus")
	public ResponseEntity<?> getCourseSyllabus(@PathVariable Long courseId) {
		Courses course = courseService.getCourseById(courseId);
		if (course != null && course.getSyllabus() != null) {
			return ResponseEntity.ok(Map.of("content", course.getSyllabus()));
		}
		return ResponseEntity.ok(Map.of("content", List.of()));
	}

	@PostMapping("/courses/{courseId}/syllabus")
	@Operation(description = "Update course syllabus")
	public ResponseEntity<?> updateCourseSyllabus(@PathVariable Long courseId, @RequestBody Map<String, List<?>> payload) {
		List<?> syllabusData = payload.get("content");
		courseService.updateCourseSyllabus(courseId, syllabusData);
		return ResponseEntity.ok(new ApiResponse("success", "Syllabus updated successfully"));
	}

	@PostMapping("/courses/{courseId}/outcomes")
	@Operation(description = "Update course outcomes")
	public ResponseEntity<?> updateCourseOutcomes(@PathVariable Long courseId, @RequestBody Map<String, List<String>> payload) {
		List<String> outcomes = payload.get("outcomes");
		Courses course = courseService.getCourseById(courseId);
		course.setOutcomes(outcomes != null ? outcomes : List.of());
		courseRepository.save(course);
		return ResponseEntity.ok(new ApiResponse("success", "Outcomes updated successfully"));
	}
}
