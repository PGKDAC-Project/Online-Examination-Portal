package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "randomization_rules")
@AttributeOverride(name = "id", column = @Column(name = "rule_id"))
@Getter
@Setter
@NoArgsConstructor
public class RandomizationRule extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, unique = true)
    private Courses course;

    @Column(name = "total_questions", nullable = false)
    private int totalQuestions = 50;

    @Column(name = "easy_count", nullable = false)
    private int easyCount = 20;

    @Column(name = "medium_count", nullable = false)
    private int mediumCount = 20;

    @Column(name = "hard_count", nullable = false)
    private int hardCount = 10;
}
