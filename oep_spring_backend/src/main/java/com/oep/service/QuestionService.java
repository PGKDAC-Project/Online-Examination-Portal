package com.oep.service;

import java.util.List;
import com.oep.entities.Question;

public interface QuestionService {
    List<Question> getAllQuestions();

    List<Question> getQuestionsByCourse(Long courseId);

    Question getQuestionById(Long id);

    Question createQuestion(Question question);

    Question updateQuestion(Long id, Question question);

    void deleteQuestion(Long id);
}
