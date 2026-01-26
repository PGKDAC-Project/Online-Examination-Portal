package com.oep.service;

import java.util.List;
import com.oep.entities.Exam;

public interface ExamService {
    List<Exam> getAllExams();

    List<Exam> getExamsByInstructor(Long instructorId);

    List<Exam> getExamsByStudent(Long studentId);

    Exam getExamById(Long id);

    Exam createExam(Exam exam);

    Exam updateExam(Long id, Exam exam);

    void deleteExam(Long id);
}
