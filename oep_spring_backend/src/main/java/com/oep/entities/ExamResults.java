package com.oep.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "exam_results", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "exam_id", "student_id" }) }, indexes = {
				@Index(name = "idx_exam_results_exam", columnList = "exam_id"),
				@Index(name = "idx_exam_results_student", columnList = "student_id"),
				@Index(name = "idx_exam_results_status", columnList = "status") })
@AttributeOverride(name = "id", column = @Column(name = "result_id"))
@Getter
@Setter
public class ExamResults extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable = false)
	@JsonIgnore
	private Exam exam;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	@JsonIgnore
	private User student;

	@Column(name = "total_marks", nullable = false)
	private Integer totalMarks;

	@Column(name = "total_score", nullable = false)
	private Integer totalScore = 0;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private ResultStatus status = ResultStatus.PENDING;

	@Column(name = "submitted_at", updatable = false)
	private LocalDateTime submittedAt;

	@Column(name = "is_evaluated", nullable = false)
	private Boolean isEvaluated = false;

	@Column(name = "violation_count", nullable = false)
	private Integer violationCount = 0;

	@OneToMany(mappedBy = "examResult", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private java.util.List<ExamViolation> violations = new java.util.ArrayList<>();

	@PrePersist
	public void onSubmit() {
		this.submittedAt = LocalDateTime.now();
	}
}
