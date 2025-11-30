package com.manikanta.interviewvault.service;

import com.manikanta.interviewvault.model.Question;
import com.manikanta.interviewvault.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public Optional<Question> getQuestionById(String id) {
        return questionRepository.findById(id);
    }

    @Override
    public List<Question> getQuestionsByCategory(String category) {
        return questionRepository.findByCategory(category);
    }

    @Override
    public List<Question> searchQuestions(String keyword) {
        return questionRepository.searchByKeyword(keyword);
    }

    @Override
    public Question createQuestion(Question question) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        question.setCreatedBy(username);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());

        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(String id, Question question) {
        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        existing.setCategory(question.getCategory());
        existing.setDifficulty(question.getDifficulty());
        existing.setQuestion(question.getQuestion());
        existing.setAnswer(question.getAnswer());
        existing.setTags(question.getTags());
        existing.setUpdatedAt(LocalDateTime.now());

        return questionRepository.save(existing);
    }

    @Override
    public void deleteQuestion(String id) {
        questionRepository.deleteById(id);
    }
}
