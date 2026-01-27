package com.oep.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.ExamResults;
import com.oep.repository.ResultRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {
    private final ResultRepository resultRepository;

    @Override
    public List<ExamResults> getAllResults() {
        return resultRepository.findAll();
    }

    @Override
    public List<ExamResults> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    @Override
    public List<ExamResults> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId);
    }

    @Override
    public ExamResults getResultById(Long id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + id));
    }

    @Override
    public ExamResults submitResult(ExamResults result) {
        return resultRepository.save(result);
    }
}
