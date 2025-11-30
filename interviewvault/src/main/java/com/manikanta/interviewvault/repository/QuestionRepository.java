package com.manikanta.interviewvault.repository;

import com.manikanta.interviewvault.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByCategory(String category);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByCategoryAndDifficulty(String category, String difficulty);

    @Query("{ $or: [ " +
            "{ 'question': { $regex: ?0, $options: 'i' } }, " +
            "{ 'answer': { $regex: ?0, $options: 'i' } }, " +
            "{ 'tags': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Question> searchByKeyword(String keyword);

    List<Question> findByCreatedBy(String userId);
}
