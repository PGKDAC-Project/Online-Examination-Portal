package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.Question;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCourseId(Long courseId);
}
