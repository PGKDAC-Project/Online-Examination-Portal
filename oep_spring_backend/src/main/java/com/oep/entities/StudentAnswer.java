package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "student_answers",
    indexes = {
        @Index(name = "idx_answer_result", columnList = "result_id"),
        @Index(name = "idx_answer_question", columnList = "question_id")
    }
)
@AttributeOverride(name = "id", column = @Column(name = "answer_id"))
@Getter
@Setter
public class StudentAnswer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private ExamResults examResult;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    /* Selected answer*/

    @Column(name = "selected_option_json", columnDefinition = "json")
    private String selectedOptionJson;

    /* Evaluation*/

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "marks_awarded", nullable = false)
    private Integer marksAwarded = 0;

    /* To make it randomized */

    @Column(name = "question_order")
    private Integer questionOrder;
}
