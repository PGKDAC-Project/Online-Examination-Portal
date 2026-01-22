package com.oep.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;


@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ExamQuestionId implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "exam_id")
	private Long examId;
	
	@Column(name = "question_id")
	private Long questionId;
}