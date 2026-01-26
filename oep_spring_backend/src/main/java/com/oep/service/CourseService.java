package com.oep.service;

import java.util.List;
import com.oep.entities.Courses;
import com.oep.dtos.CourseRequestDto;

public interface CourseService {
	List<Courses> getAllCourses();

	List<Courses> getCoursesByInstructor(Long instructorId);

	List<Courses> getCoursesByStudent(Long studentId);

	Courses getCourseById(Long id);

	Courses createCourse(CourseRequestDto course);

	Courses updateCourse(Long id, CourseRequestDto course);

	void updateCourseStatus(Long id, String status);

	void deleteCourse(Long id);
}
