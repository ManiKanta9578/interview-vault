package com.manikanta.interviewvault.controller;

import com.manikanta.interviewvault.model.Question;
import com.manikanta.interviewvault.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // Get all questions for the logged-in user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Question>> getAllQuestions() {
        String username = getCurrentUsername();
        return ResponseEntity.ok(questionService.getQuestionsByUser(username));
    }

    // Get question by ID (only if it belongs to the user)
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
        String username = getCurrentUsername();
        return questionService.getQuestionByIdAndUser(id, username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get user's questions by category
    @GetMapping("/category/{category}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Question>> getByCategory(@PathVariable String category) {
        String username = getCurrentUsername();
        return ResponseEntity.ok(questionService.getQuestionsByCategoryAndUser(category, username));
    }

    // Search user's questions
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Question>> searchQuestions(@RequestParam String keyword) {
        String username = getCurrentUsername();
        return ResponseEntity.ok(questionService.searchQuestionsByUser(keyword, username));
    }

    // Create question (automatically assigned to logged-in user)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        String username = getCurrentUsername();
        Question created = questionService.createQuestion(question, username);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Update question (only if it belongs to the user)
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable String id,
            @RequestBody Question question) {
        String username = getCurrentUsername();
        try {
            Question updated = questionService.updateQuestion(id, question, username);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete question (only if it belongs to the user)
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        String username = getCurrentUsername();
        try {
            questionService.deleteQuestion(id, username);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get count of user's questions
    @GetMapping("/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getQuestionCount() {
        String username = getCurrentUsername();
        return ResponseEntity.ok(questionService.countQuestionsByUser(username));
    }

    // Helper method to get current username
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
