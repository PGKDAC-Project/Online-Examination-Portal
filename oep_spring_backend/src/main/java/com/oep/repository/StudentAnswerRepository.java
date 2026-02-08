package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.StudentAnswer;
import java.util.List;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByExamResultId(Long resultId);
}
