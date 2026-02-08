package com.oep.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.oep.entities.ExamQuestions;
import com.oep.entities.ExamQuestionId;

public interface ExamQuestionsRepository extends JpaRepository<ExamQuestions, ExamQuestionId> {
    @Query("SELECT eq FROM ExamQuestions eq JOIN FETCH eq.question WHERE eq.examQuestionId.examId = :examId ORDER BY eq.sequenceOrder ASC")
    List<ExamQuestions> findByExamQuestionIdExamIdOrderBySequenceOrderAsc(@Param("examId") Long examId);
}
