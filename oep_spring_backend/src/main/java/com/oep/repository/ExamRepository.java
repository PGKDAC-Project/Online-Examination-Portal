package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.Exam;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    java.util.List<Exam> findByCourseInstructorDetailsId(Long instructorId);

    java.util.List<Exam> findByCourseIdIn(java.util.List<Long> courseIds);
}
