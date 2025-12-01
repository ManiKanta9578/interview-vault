package com.manikanta.interviewvault.service;

import com.manikanta.interviewvault.model.Question;
import com.manikanta.interviewvault.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    public List<Question> getQuestionsByUser(String username) {
        return questionRepository.findByCreatedBy(username);
    }

    @Override
    public Optional<Question> getQuestionByIdAndUser(String id, String username) {
        return questionRepository.findByIdAndCreatedBy(id, username);
    }

    @Override
    public List<Question> getQuestionsByCategoryAndUser(String category, String username) {
        return questionRepository.findByCategoryAndCreatedBy(category, username);
    }

    @Override
    public List<Question> searchQuestionsByUser(String keyword, String username) {
        return questionRepository.searchByKeywordAndUser(keyword, username);
    }

    @Override
    public Question createQuestion(Question question, String username) {
        question.setCreatedBy(username);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(String id, Question question, String username) {
        Question existing = questionRepository.findByIdAndCreatedBy(id, username)
                .orElseThrow(() -> new RuntimeException("Question not found or unauthorized"));

        existing.setCategory(question.getCategory());
        existing.setDifficulty(question.getDifficulty());
        existing.setQuestion(question.getQuestion());
        existing.setAnswer(question.getAnswer());
        existing.setTags(question.getTags());
        existing.setUpdatedAt(LocalDateTime.now());

        return questionRepository.save(existing);
    }

    @Override
    public void deleteQuestion(String id, String username) {
        Question question = questionRepository.findByIdAndCreatedBy(id, username)
                .orElseThrow(() -> new RuntimeException("Question not found or unauthorized"));
        questionRepository.delete(question);
    }

    @Override
    public Long countQuestionsByUser(String username) {
        return questionRepository.countByCreatedBy(username);
    }
}
