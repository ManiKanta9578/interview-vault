package com.manikanta.interviewvault.repository;

import com.manikanta.interviewvault.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {

    // Find all questions by user
    List<Question> findByCreatedBy(String createdBy);

    // Find question by ID and user
    Optional<Question> findByIdAndCreatedBy(String id, String createdBy);

    // Find by category and user
    List<Question> findByCategoryAndCreatedBy(String category, String createdBy);

    // Find by difficulty and user
    List<Question> findByDifficultyAndCreatedBy(String difficulty, String createdBy);

    // Find by category, difficulty and user
    List<Question> findByCategoryAndDifficultyAndCreatedBy(
            String category, String difficulty, String createdBy);

    // Search by keyword (in question, answer, or tags) for specific user
    @Query("{ 'createdBy': ?1, $or: [ " +
            "{ 'question': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'tags': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Question> searchByKeywordAndUser(String keyword, String createdBy);

    // Count questions by user
    Long countByCreatedBy(String createdBy);
}
