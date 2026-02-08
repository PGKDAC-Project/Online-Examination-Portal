package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.ExamResults;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<ExamResults, Long> {
    List<ExamResults> findByStudentId(Long studentId);

    List<ExamResults> findByExamId(Long examId);
    
    Optional<ExamResults> findByExamIdAndStudentId(Long examId, Long studentId);
}
