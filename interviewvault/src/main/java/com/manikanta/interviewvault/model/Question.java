package com.manikanta.interviewvault.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    private String id;

    @Indexed
    private String category;

    @Indexed
    private String difficulty;

    private String question;

    // Rich content stored as JSON string (text, code, images, tables)
    private String answer;

    private String tags;

    @Indexed
    private String createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
