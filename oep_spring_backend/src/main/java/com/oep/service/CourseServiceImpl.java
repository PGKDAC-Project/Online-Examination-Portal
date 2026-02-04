package com.oep.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.Courses;
import com.oep.entities.Status;
import com.oep.repository.CourseRepository;
import com.oep.dtos.CourseRequestDto;
import com.oep.dtos.CourseResponseDto;
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
	private final ModelMapper modelMapper;

	@Override
	public List<Courses> getAllCourses() {
		return courseRepository.findAll();
	}
	
	public List<CourseResponseDto> getAllCoursesDto() {
		return courseRepository.findAll().stream()
				.map(this::mapToDto)
				.collect(Collectors.toList());
	}
	
	public CourseResponseDto mapToDto(Courses course) {
		CourseResponseDto dto = modelMapper.map(course, CourseResponseDto.class);
		
		// Map instructors manually since it's a list
		if (course.getInstructors() != null && !course.getInstructors().isEmpty()) {
			List<CourseResponseDto.InstructorDto> instructorDtos = course.getInstructors().stream()
					.map(instructor -> {
						CourseResponseDto.InstructorDto iDto = new CourseResponseDto.InstructorDto();
						iDto.setId(instructor.getId());
						iDto.setName(instructor.getUserName());
						iDto.setEmail(instructor.getEmail());
						iDto.setRole(instructor.getRole().toString());
						return iDto;
					})
					.collect(Collectors.toList());
			dto.setInstructors(instructorDtos);
		}
		
		return dto;
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
		
		// Set status - default to ACTIVE if not provided
		if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
			course.setStatus(Status.valueOf(dto.getStatus().toUpperCase()));
		} else {
			course.setStatus(Status.ACTIVE);
		}
		
		// Handle multiple instructors
		if (dto.getInstructorIds() != null && !dto.getInstructorIds().isEmpty()) {
			List<User> instructors = new ArrayList<>();
			for (Long instructorId : dto.getInstructorIds()) {
				User instructor = userRepository.findById(instructorId)
						.orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + instructorId));
				instructors.add(instructor);
			}
			course.setInstructors(instructors);
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
		
		// Handle multiple instructors - can be null or empty
		if (courseDetails.getInstructorIds() != null && !courseDetails.getInstructorIds().isEmpty()) {
			List<User> instructors = new ArrayList<>();
			for (Long instructorId : courseDetails.getInstructorIds()) {
				User instructor = userRepository.findById(instructorId)
						.orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + instructorId));
				instructors.add(instructor);
			}
			course.setInstructors(instructors);
		} else {
			course.setInstructors(new ArrayList<>());
		}
		
		// Handle status if provided
		if (courseDetails.getStatus() != null && !courseDetails.getStatus().trim().isEmpty()) {
			course.setStatus(Status.valueOf(courseDetails.getStatus().toUpperCase()));
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
