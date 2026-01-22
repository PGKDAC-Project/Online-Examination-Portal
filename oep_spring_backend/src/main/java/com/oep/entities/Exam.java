package com.oep.entities;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@AttributeOverride(name = "id", column = @Column(name = "exam_id"))
@Entity
@Table(name = "exams")
@Getter
@Setter
public class Exam extends BaseEntity{
	
	@Column(name = "exam_title", nullable = false)
	private String examTitle;
	
	@ManyToOne
	@JoinColumn(name = "course_id", nullable = false)
	private Courses course;
	
	
	@Column(name = "scheduled_date")
	private LocalDate scheduledDate;
	
	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;
	
	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;
	
	@Column(nullable = false, length = 4)
	private Integer duration;
	
	@Column(name = "total_marks", length = 4)
	private Integer totalMarks;
	
	@Column(name = "passing_marks", nullable = false, length = 4)
	private Integer passingMarks;
	

	@ManyToMany
	@JoinTable(
	    name = "exam_questions",
	    joinColumns = @JoinColumn(name = "exam_id"),
	    inverseJoinColumns = @JoinColumn(name = "question_id")
	)
	private Set<Question> questions = new HashSet<>();
	
	@ManyToOne
	@JoinColumn(name = "created_by", nullable = false)
	private User instructor;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ExamStatus status;
}
