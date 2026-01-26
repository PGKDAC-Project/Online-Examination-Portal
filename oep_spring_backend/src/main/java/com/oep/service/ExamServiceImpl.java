package com.oep.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.Exam;
import com.oep.repository.ExamRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import com.oep.custom_exceptions.InvalidInputException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository examRepository;
    private final CourseService courseService;

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public List<Exam> getExamsByInstructor(Long instructorId) {
        return examRepository.findByCourseInstructorDetailsId(instructorId);
    }

    @Override
    public List<Exam> getExamsByStudent(Long studentId) {
        var courses = courseService.getCoursesByStudent(studentId);
        List<Long> courseIds = courses.stream().map(c -> c.getId()).collect(Collectors.toList());
        if (courseIds.isEmpty())
            return List.of();
        return examRepository.findByCourseIdIn(courseIds);
    }

    @Override
    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
    }

    @Override
    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    @Override
    public Exam updateExam(Long id, Exam examDetails) {
        Exam exam = getExamById(id);
        exam.setExamTitle(examDetails.getExamTitle());
        exam.setScheduledDate(examDetails.getScheduledDate());
        exam.setStartTime(examDetails.getStartTime());
        exam.setEndTime(examDetails.getEndTime());
        exam.setDuration(examDetails.getDuration());
        exam.setTotalMarks(examDetails.getTotalMarks());
        exam.setPassingMarks(examDetails.getPassingMarks());
        exam.setStatus(examDetails.getStatus());
        exam.setExamPassword(examDetails.getExamPassword());
        return examRepository.save(exam);
    }

    @Override
    public void deleteExam(Long id) {
        Exam exam = getExamById(id);
        examRepository.delete(exam);
    }

    @Override
    public boolean verifyPassword(Long examId, String password) {
        Exam exam = getExamById(examId);
        if (exam.getExamPassword() == null || exam.getExamPassword().isEmpty()) {
            return true; // No password set
        }
        return exam.getExamPassword().equals(password);
    }
}
