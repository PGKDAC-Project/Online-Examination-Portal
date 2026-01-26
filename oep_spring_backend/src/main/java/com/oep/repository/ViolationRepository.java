package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.ExamViolation;
import java.util.List;

public interface ViolationRepository extends JpaRepository<ExamViolation, Long> {
    List<ExamViolation> findByExamResultExamId(Long examId);

    List<ExamViolation> findByExamResultStudentId(Long studentId);
}
