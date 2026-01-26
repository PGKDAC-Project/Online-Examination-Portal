package com.oep.service;

import java.util.List;
import com.oep.entities.Courses;

public interface CourseService {
	List<Courses> getAllCourses();

	List<Courses> getCoursesByInstructor(Long instructorId);

	List<Courses> getCoursesByStudent(Long studentId);

	Courses getCourseById(Long id);

	Courses createCourse(Courses course);

	Courses updateCourse(Long id, Courses course);

	void deleteCourse(Long id);
}
