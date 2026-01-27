package com.oep.service;

import java.util.List;
import com.oep.entities.Exam;
import com.oep.entities.ExamQuestions;

public interface ExamService {
    List<Exam> getAllExams();

    List<Exam> getExamsByInstructor(Long instructorId);

    List<Exam> getExamsByStudent(Long studentId);

    Exam getExamById(Long id);

    Exam createExam(Exam exam);

    Exam updateExam(Long id, Exam exam);

    void deleteExam(Long id);

    void addQuestionToExam(Long examId, Long questionId);
    
    void removeQuestionFromExam(Long examId, Long questionId);

    boolean verifyPassword(Long examId, String password);

    com.oep.entities.ExamResults submitExam(Long examId, Long studentId, java.util.Map<Long, String> answers);

	List<ExamQuestions> getExamQuestions(Long examId);
}
