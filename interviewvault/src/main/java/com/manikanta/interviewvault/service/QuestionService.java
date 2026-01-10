package com.manikanta.interviewvault.service;

import com.manikanta.interviewvault.model.Question;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    List<Question> getQuestionsByUser(String username);
    Optional<Question> getQuestionByIdAndUser(String id, String username);
    List<Question> getQuestionsByCategoryAndUser(String category, String username);
    List<Question> getQuestionsBySubcategoryAndUser(String subCategory, String username);
    List<Question> searchQuestionsByUser(String keyword, String username);
    Question createQuestion(Question question, String username);
    Question updateQuestion(String id, Question question, String username);
    void deleteQuestion(String id, String username);
    Long countQuestionsByUser(String username);
}
