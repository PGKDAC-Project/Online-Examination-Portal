package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.ExamResults;
import java.util.List;

public interface ResultRepository extends JpaRepository<ExamResults, Long> {
    List<ExamResults> findByUserId(Long userId);

    List<ExamResults> findByExamId(Long examId);
}
