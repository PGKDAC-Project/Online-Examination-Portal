package com.oep.service;

import com.oep.entities.Enrollment;
import com.oep.entities.Courses;
import com.oep.entities.User;
import com.oep.repository.CourseRepository;
import com.oep.repository.UserRepository;
import com.oep.repository.EnrollmentRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import com.oep.custom_exceptions.ConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EnrollmentService {
    Enrollment enrollStudent(Long studentId, Long courseId);

    List<Courses> getAvailableCourses(Long studentId);
}

@Service
@Transactional
@RequiredArgsConstructor
class EnrollmentServiceImpl implements EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Override
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Courses course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new ConflictException("Already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<Courses> getAvailableCourses(Long studentId) {
        // Simple logic: any course the student is NOT enrolled in
        List<Courses> allCourses = courseRepository.findAll();
        List<Courses> enrolledCourses = courseRepository.findCoursesByStudentId(studentId);
        allCourses.removeAll(enrolledCourses);
        return allCourses;
    }
}
