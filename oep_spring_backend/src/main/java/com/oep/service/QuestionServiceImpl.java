package com.oep.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.oep.entities.Question;
import com.oep.repository.QuestionRepository;
import com.oep.custom_exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public List<Question> getQuestionsByCourse(Long courseId) {
        return questionRepository.findByCourseId(courseId);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
    }

    @Override
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);
        question.setQuestionText(questionDetails.getQuestionText());
        question.setType(questionDetails.getType());
        question.setLevel(questionDetails.getLevel());
        question.setMarksAllotted(questionDetails.getMarksAllotted());
        question.setOptions(questionDetails.getOptions());
        question.setCorrectAnswers(questionDetails.getCorrectAnswers());
        question.setMatchingPairs(questionDetails.getMatchingPairs());
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);
        questionRepository.delete(question);
    }
}
