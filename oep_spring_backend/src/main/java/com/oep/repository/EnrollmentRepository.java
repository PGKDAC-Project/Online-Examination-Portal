package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
