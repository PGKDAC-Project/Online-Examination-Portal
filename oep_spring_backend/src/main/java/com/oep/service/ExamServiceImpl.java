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
    private final com.oep.repository.CourseRepository courseRepository;

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
        if (examDetails.getExamTitle() != null) exam.setExamTitle(examDetails.getExamTitle());
        if (examDetails.getScheduledDate() != null) exam.setScheduledDate(examDetails.getScheduledDate());
        if (examDetails.getStartTime() != null) exam.setStartTime(examDetails.getStartTime());
        if (examDetails.getEndTime() != null) exam.setEndTime(examDetails.getEndTime());
        if (examDetails.getDuration() != null) exam.setDuration(examDetails.getDuration());
        if (examDetails.getPassingMarks() != null) exam.setPassingMarks(examDetails.getPassingMarks());
        if (examDetails.getStatus() != null) exam.setStatus(examDetails.getStatus());
        if (examDetails.getExamPassword() != null) exam.setExamPassword(examDetails.getExamPassword());
        if (examDetails.getResultPublished() != null) exam.setResultPublished(examDetails.getResultPublished());
        if (examDetails.getAnswerReviewAllowed() != null) exam.setAnswerReviewAllowed(examDetails.getAnswerReviewAllowed());
        if (examDetails.getScorecardReleased() != null) exam.setScorecardReleased(examDetails.getScorecardReleased());
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
        
        // Recalculate total marks and questions
        updateExamTotals(examId);
    }

    @Override
    public void removeQuestionFromExam(Long examId, Long questionId) {
        ExamQuestionId eqId = new ExamQuestionId();
        eqId.setExamId(examId);
        eqId.setQuestionId(questionId);
        
        ExamQuestions eq = examQuestionsRepository.findById(eqId)
                 .orElseThrow(() -> new ResourceNotFoundException("Question not associated with exam"));
        
        examQuestionsRepository.delete(eq);
        
        // Recalculate total marks and questions
        updateExamTotals(examId);
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

        // Check if result already exists
        ExamResults existingResult = resultRepository.findByExamIdAndStudentId(examId, studentId).orElse(null);
        if (existingResult != null) {
            throw new InvalidInputException("You have already submitted this exam");
        }
        
        // Calculate total marks from questions
        List<ExamQuestions> examQuestions = examQuestionsRepository.findByExamQuestionIdExamIdOrderBySequenceOrderAsc(examId);
        int calculatedTotalMarks = examQuestions.stream()
                .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                .sum();

        ExamResults result = new ExamResults();
        result.setExam(exam);
        result.setStudent(student);
        result.setTotalMarks(calculatedTotalMarks);
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
                
                // Convert to proper JSON string if needed
                String jsonAnswer = selectedOption;
                if (selectedOption != null && !selectedOption.trim().startsWith("[") && !selectedOption.trim().startsWith("{")) {
                    // Simple string, wrap in quotes for JSON
                    jsonAnswer = "\"" + selectedOption.replace("\"", "\\\"") + "\"";
                }
                answer.setSelectedOptionJson(jsonAnswer); 
                
                // Simple auto-grading logic
                boolean isCorrect = false;
                if (question.getCorrectAnswers() != null && !question.getCorrectAnswers().isEmpty()) {
                    try {
                        // Parse JSON answer
                        if (selectedOption.trim().startsWith("[")) {
                            // Array answer (MULTIPLE_SELECT)
                            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                            java.util.List<String> selectedList = mapper.readValue(selectedOption, new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>(){});
                            // Check if all selected are correct and all correct are selected
                            isCorrect = selectedList.size() == question.getCorrectAnswers().size() &&
                                       selectedList.stream().allMatch(s -> question.getCorrectAnswers().stream()
                                           .anyMatch(c -> c.trim().equalsIgnoreCase(s.trim())));
                        } else if (selectedOption.trim().startsWith("{")) {
                            // Object answer (MATCHING) - skip for now
                            isCorrect = false;
                        } else {
                            // Single answer (MCQ, TRUE_FALSE)
                            String cleanAnswer = selectedOption.replace("\"", "").trim();
                            isCorrect = question.getCorrectAnswers().stream()
                                .anyMatch(c -> c.trim().equalsIgnoreCase(cleanAnswer));
                        }
                    } catch (Exception e) {
                        // Fallback to simple comparison
                        String normalizedSelected = selectedOption.replace("\"", "").trim().toLowerCase();
                        isCorrect = question.getCorrectAnswers().stream()
                            .anyMatch(c -> c.trim().toLowerCase().equals(normalizedSelected));
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
    
    @Override
    public Courses getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
    }
    
    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
    
    private void updateExamTotals(Long examId) {
        Exam exam = getExamById(examId);
        List<ExamQuestions> questions = examQuestionsRepository.findByExamQuestionIdExamIdOrderBySequenceOrderAsc(examId);
        
        int totalMarks = questions.stream()
                .mapToInt(eq -> eq.getQuestion().getMarksAllotted())
                .sum();
        
        exam.setTotalMarks(totalMarks);
        exam.setTotalQuestions(questions.size());
        examRepository.save(exam);
    }
    
    @Override
    public List<ExamResults> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId);
    }
}
