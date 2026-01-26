package com.oep.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.Courses;
import com.oep.repository.CourseRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
	private final CourseRepository courseRepository;

	@Override
	public List<Courses> getAllCourses() {
		return courseRepository.findAll();
	}

	@Override
	public List<Courses> getCoursesByInstructor(Long instructorId) {
		return courseRepository.findByInstructorDetailsId(instructorId);
	}

	@Override
	public List<Courses> getCoursesByStudent(Long studentId) {
		return courseRepository.findCoursesByStudentId(studentId);
	}

	@Override
	public Courses getCourseById(Long id) {
		return courseRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
	}

	@Override
	public Courses createCourse(Courses course) {
		return courseRepository.save(course);
	}

	@Override
	public Courses updateCourse(Long id, Courses courseDetails) {
		Courses course = getCourseById(id);
		course.setTitle(courseDetails.getTitle());
		course.setDescription(courseDetails.getDescription());
		course.setCourseCode(courseDetails.getCourseCode());
		course.setSyllabus(courseDetails.getSyllabus());
		course.setOutcomes(courseDetails.getOutcomes());
		// Do not update instructor unless explicitly intended
		if (courseDetails.getInstructorDetails() != null) {
			course.setInstructorDetails(courseDetails.getInstructorDetails());
		}
		return courseRepository.save(course);
	}

	@Override
	public void deleteCourse(Long id) {
		Courses course = getCourseById(id);
		courseRepository.delete(course);
	}
}
