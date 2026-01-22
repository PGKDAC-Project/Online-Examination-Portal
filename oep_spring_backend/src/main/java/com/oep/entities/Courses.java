package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.Setter;

@AttributeOverride(name = "id", column = @Column(name = "course_id"))
@Entity
@Getter
@Setter
public class Courses extends BaseEntity{
	
	@Column(name = "course_code", nullable = false, length = 15)
	private String courseCode;
	
	@Column(length = 100, nullable = false)
	private String title;
	
	@Column(nullable = false)
	private String description;
	
	@ElementCollection
	@CollectionTable(name = "course_syllabus", joinColumns = @JoinColumn(name = "course_code"))
	@OrderBy("moduleNumber Asc")
	private Syllabus syllabus;
	
	@ManyToOne
	@JoinColumn(name = "instructor_id")
	private User instructorDetails;
	
}
