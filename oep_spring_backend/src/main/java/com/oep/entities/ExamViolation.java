package com.oep.entities;

import java.time.LocalDateTime;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exam_violations")
@AttributeOverride(name = "id", column = @Column(name = "violation_id"))
@Getter
@Setter
@NoArgsConstructor
public class ExamViolation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private ExamResults examResult;

    @Enumerated(EnumType.STRING)
    @Column(name = "violation_type", nullable = false, length = 50)
    private ViolationType type;

    @Column(name = "violation_details", length = 500)
    private String detail;

    @Column(name = "violation_timestamp", nullable = false)
    private LocalDateTime timestamp;
}
