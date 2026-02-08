package com.oep.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.Exam;
import com.oep.entities.ExamStatus;
import com.oep.repository.ExamRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExamStatusScheduler {
    
    private final ExamRepository examRepository;
    
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void updateExamStatuses() {
        List<Exam> exams = examRepository.findAll();
        
        for (Exam exam : exams) {
            if (exam.getScheduledDate() == null) continue;
            
            LocalDateTime examStart = LocalDateTime.of(exam.getScheduledDate(), exam.getStartTime());
            LocalDateTime examEnd = LocalDateTime.of(exam.getScheduledDate(), exam.getEndTime());
            LocalDateTime now = LocalDateTime.now();
            
            ExamStatus newStatus = null;
            
            if (now.isBefore(examStart)) {
                newStatus = ExamStatus.SCHEDULED;
            } else if (now.isAfter(examEnd)) {
                newStatus = ExamStatus.COMPLETED;
            } else {
                newStatus = ExamStatus.ONGOING;
            }
            
            if (exam.getStatus() != newStatus) {
                exam.setStatus(newStatus);
                examRepository.save(exam);
            }
        }
    }
}
