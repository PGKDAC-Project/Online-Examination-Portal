package com.oep.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.ExamQuestions;
import com.oep.entities.ExamQuestionId;

public interface ExamQuestionsRepository extends JpaRepository<ExamQuestions, ExamQuestionId> {
    List<ExamQuestions> findByExamQuestionIdExamIdOrderBySequenceOrderAsc(Long examId);
}
