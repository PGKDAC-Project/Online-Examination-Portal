package com.oep.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.Setter;

@AttributeOverride(name = "id", column = @Column(name = "course_id"))
@Entity
@Getter
@Setter
public class Courses extends BaseEntity {

	@Column(name = "course_code", nullable = false, length = 15)
	private String courseCode;

	@Column(length = 100, nullable = false)
	private String title;

	@Column(nullable = false)
	private String description;

	@ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
	@CollectionTable(name = "course_syllabus", joinColumns = @JoinColumn(name = "course_id"))
	@OrderBy("moduleNo ASC")
	private List<Syllabus> syllabus = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "instructor_id")
	private User instructorDetails;

	@ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
	@CollectionTable(name = "course_outcomes", joinColumns = @JoinColumn(name = "course_id"))
	@Column(name = "outcome_text")
	private List<String> outcomes = new ArrayList<>();
	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private Status status = Status.ACTIVE;

}
