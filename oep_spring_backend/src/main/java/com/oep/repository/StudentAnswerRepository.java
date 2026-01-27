package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.StudentAnswer;

public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
}
