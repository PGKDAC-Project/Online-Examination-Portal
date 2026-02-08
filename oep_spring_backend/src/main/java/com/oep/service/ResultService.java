package com.oep.service;

import java.util.List;
import com.oep.entities.ExamResults;

public interface ResultService {
    List<ExamResults> getAllResults();

    List<ExamResults> getResultsByStudent(Long studentId);

    List<ExamResults> getResultsByExam(Long examId);

    ExamResults getResultById(Long id);

    ExamResults submitResult(ExamResults result);
    
    List<com.oep.entities.StudentAnswer> getStudentAnswersByResultId(Long resultId);
    
    List<com.oep.entities.ExamQuestions> getExamQuestions(Long examId);
}
