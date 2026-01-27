package com.oep.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.*;
import com.oep.repository.ExamRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import com.oep.dtos.UserResponseDto;
import com.oep.custom_exceptions.InvalidInputException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository examRepository;
    private final CourseService courseService;
    private final com.oep.repository.QuestionRepository questionRepository;
    private final com.oep.repository.ExamQuestionsRepository examQuestionsRepository;
    private final com.oep.repository.ResultRepository resultRepository;
    private final com.oep.repository.UserRepository userRepository;
    private final com.oep.repository.StudentAnswerRepository studentAnswerRepository;

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public List<Exam> getExamsByInstructor(Long instructorId) {
        return examRepository.findByInstructorDetailsId(instructorId);
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
    public void addQuestionToExam(Long examId, Long questionId) {
        Exam exam = getExamById(examId);
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        
        ExamQuestionId eqId = new ExamQuestionId();
        eqId.setExamId(examId);
        eqId.setQuestionId(questionId);
        
        ExamQuestions eq = new ExamQuestions();
        eq.setExamQuestionId(eqId);
        eq.setExam(exam);
        eq.setQuestion(question);
        eq.setSequenceOrder(0); // Default order
        
        examQuestionsRepository.save(eq);
    }

    @Override
    public void removeQuestionFromExam(Long examId, Long questionId) {
        ExamQuestionId eqId = new ExamQuestionId();
        eqId.setExamId(examId);
        eqId.setQuestionId(questionId);
        
        ExamQuestions eq = examQuestionsRepository.findById(eqId)
                 .orElseThrow(() -> new ResourceNotFoundException("Question not associated with exam"));
        
        examQuestionsRepository.delete(eq);
    }

    @Override
    public List<ExamQuestions> getExamQuestions(Long examId) {
        return examQuestionsRepository.findByExamQuestionIdExamIdOrderBySequenceOrderAsc(examId);
    }

    @Override
    public boolean verifyPassword(Long examId, String password) {
        Exam exam = getExamById(examId);
        if (exam.getExamPassword() == null || exam.getExamPassword().isEmpty()) {
            return true; // No password set
        }
        return exam.getExamPassword().equals(password);
    }

    @Override
    public ExamResults submitExam(Long examId, Long studentId, java.util.Map<Long, String> answers) {
        Exam exam = getExamById(examId);
        
        // Get User entity from repository
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        ExamResults result = new ExamResults();
        result.setExam(exam);
        result.setStudent(student);
        result.setTotalMarks(exam.getTotalMarks());
        result.setTotalScore(0);
        result.setStatus(ResultStatus.SUBMITTED);
        result.setIsEvaluated(false); 
        
        ExamResults savedResult = resultRepository.save(result);

        int totalScore = 0;
        
        for (java.util.Map.Entry<Long, String> entry : answers.entrySet()) {
            Long questionId = entry.getKey();
            String selectedOption = entry.getValue();

            Question question = questionRepository.findById(questionId).orElse(null);
            if (question != null) {
                StudentAnswer answer = new StudentAnswer();
                answer.setExamResult(savedResult);
                answer.setQuestion(question);
                answer.setSelectedOptionJson(selectedOption); 
                
                // Simple auto-grading logic - handle correctAnswers as Set
                boolean isCorrect = false;
                if (question.getCorrectAnswers() != null && !question.getCorrectAnswers().isEmpty()) {
                    // Check if selected option is in the set of correct answers (case-insensitive)
                    String normalizedSelected = selectedOption.trim().toLowerCase();
                    for (String correct : question.getCorrectAnswers()) {
                        if (correct.trim().toLowerCase().equals(normalizedSelected)) {
                            isCorrect = true;
                            break;
                        }
                    }
                }
                
                int awardedMarks = isCorrect ? question.getMarksAllotted() : 0;
                totalScore += awardedMarks;
                
                answer.setIsCorrect(isCorrect);
                answer.setMarksAwarded(awardedMarks);
                
                studentAnswerRepository.save(answer);
            }
        }
        
        savedResult.setTotalScore(totalScore);
        savedResult.setIsEvaluated(true); // Auto-evaluated
        if (totalScore >= exam.getPassingMarks()) {
            savedResult.setStatus(ResultStatus.PASS);
        } else {
            savedResult.setStatus(ResultStatus.FAIL);
        }

        return resultRepository.save(savedResult);
    }
}
