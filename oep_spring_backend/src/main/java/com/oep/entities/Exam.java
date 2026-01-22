package com.oep.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@AttributeOverride(name = "id", column = @Column(name = "exam_id"))
@Entity
@Table(name = "exams", indexes = {
		@Index(name="idx_exam_course", columnList="course_id")
})
@Getter
@Setter
public class Exam extends BaseEntity{
	
	@Column(name = "exam_title", nullable = false)
	private String examTitle;
	
	@Column(name = "scheduled_date")
	private LocalDate scheduledDate;
	
	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;
	
	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;
	
	@Column(nullable = false, length = 4)
	private Integer duration;
	
	@Column(name = "total_marks", length = 4)
	private Integer totalMarks = 0;
	
	@Column(name = "passing_marks", nullable = false, length = 4)
	private Integer passingMarks;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ExamStatus status ;

	@OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    private Set<ExamQuestions> examQuestions = new LinkedHashSet<>();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Courses course;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", nullable = false)
	private User instructorDetails;
	
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 0;

    @Column(name = "average_score", precision = 6, scale = 2)
    private BigDecimal averageScore = BigDecimal.ZERO;
	
}
