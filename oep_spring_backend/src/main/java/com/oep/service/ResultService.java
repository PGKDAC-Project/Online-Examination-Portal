package com.oep.service;

import java.util.List;
import com.oep.entities.ExamResults;

public interface ResultService {
    List<ExamResults> getAllResults();

    List<ExamResults> getResultsByStudent(Long studentId);

    List<ExamResults> getResultsByExam(Long examId);

    ExamResults submitResult(ExamResults result);
}
