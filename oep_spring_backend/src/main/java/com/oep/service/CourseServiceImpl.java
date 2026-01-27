package com.oep.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.Courses;
import com.oep.entities.Status;
import com.oep.repository.CourseRepository;
import com.oep.dtos.CourseRequestDto;
import com.oep.repository.UserRepository;
import com.oep.entities.User;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
	private final CourseRepository courseRepository;
	private final UserRepository userRepository;

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
	public Courses createCourse(CourseRequestDto dto) {
		Courses course = new Courses();
		course.setTitle(dto.getTitle());
		course.setCourseCode(dto.getCourseCode());
		course.setDescription(dto.getDescription());
		if (dto.getInstructorId() != null) {
			User instructor = userRepository.findById(dto.getInstructorId())
					.orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
			course.setInstructorDetails(instructor);
		}
		if (dto.getSyllabus() != null) {
			course.setSyllabus(dto.getSyllabus());
		}
		return courseRepository.save(course);
	}

	@Override
	public Courses updateCourse(Long id, CourseRequestDto courseDetails) {
		Courses course = getCourseById(id);
		course.setTitle(courseDetails.getTitle());
		course.setDescription(courseDetails.getDescription());
		course.setCourseCode(courseDetails.getCourseCode());
		if (courseDetails.getInstructorId() != null) {
			User instructor = userRepository.findById(courseDetails.getInstructorId())
					.orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));
			course.setInstructorDetails(instructor);
		}
		if (courseDetails.getSyllabus() != null) {
			course.setSyllabus(courseDetails.getSyllabus());
		}
		return courseRepository.save(course);
	}

	@Override
	public void updateCourseStatus(Long id, String status) {
		Courses course = getCourseById(id);
		course.setStatus(Status.valueOf(status.toUpperCase()));
		courseRepository.save(course);
	}

	@Override
	public void deleteCourse(Long id) {
		Courses course = getCourseById(id);
		courseRepository.delete(course);
	}
}
