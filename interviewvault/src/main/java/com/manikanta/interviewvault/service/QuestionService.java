package com.manikanta.interviewvault.service;

import com.manikanta.interviewvault.model.Question;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    List<Question> getAllQuestions();
    Optional<Question> getQuestionById(String id);
    List<Question> getQuestionsByCategory(String category);
    List<Question> searchQuestions(String keyword);
    Question createQuestion(Question question);
    Question updateQuestion(String id, Question question);
    void deleteQuestion(String id);
}
