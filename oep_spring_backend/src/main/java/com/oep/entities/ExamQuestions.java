package com.oep.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "exam_questions")
@Getter
@Setter
public class ExamQuestions{
	@EmbeddedId
	private ExamQuestionId examQuestionId =  new ExamQuestionId();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("examId")
	@JoinColumn(name = "exam_id", nullable = false)
	@JsonIgnore
	private Exam exam;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("questionId")
	@JoinColumn(name = "question_id", nullable = false)
	private Question question;
	
	@Column(name = "sequence_order")
	private Integer sequenceOrder;
	
}
