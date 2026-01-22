package com.oep.entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@AttributeOverride(name = "id", column = @Column(name = "question_id"))
@Table(name = "questions", indexes = {
		@Index(name = "idx_question_level", columnList = "difficulty_level"),
		@Index(name = "idx_question_type", columnList = "type"),
		@Index(name = "idx_question_course", columnList = "course_id")
})
@Entity
@Getter
@Setter
public class Question extends BaseEntity{
	@Column(name = "question_code", nullable = false, unique = true, length = 30)
	private String questionCode;
	
	@Column(name = "question_text", nullable =  false)
	private String questionText;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private QuestionType type;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "difficulty_level", nullable = false, length = 30)
	private Level level;
	
	@Column(name = "marks_per_question", nullable = false, length = 5)
	private Integer marksAllotted;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Courses course;
	
	@OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
	private Set<ExamQuestions> examQuestions = new HashSet<>();
	
	//Options column
	@ElementCollection
    @CollectionTable(
        name = "question_options",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "option_text")
    private List<String> options = new ArrayList<>();
	
	//Answers column
	//MCQ, TRUE_FALSE, MSQ
	@ElementCollection
    @CollectionTable(
        name = "question_correct_answers",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "correct_answer")
    private Set<String> correctAnswers = new HashSet<>();
	
	//Matching
	@ElementCollection
    @CollectionTable(
        name = "question_matching_pairs",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @MapKeyColumn(name = "left_item")
    @Column(name = "right_item")
    private Map<String, String> matchingPairs = new HashMap<>();	
	
}
