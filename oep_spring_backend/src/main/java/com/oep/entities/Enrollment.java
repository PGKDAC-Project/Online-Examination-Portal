package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
		name = "enrollments", 
		uniqueConstraints = {@UniqueConstraint(columnNames = {"student_id", "course_id"}
		)}
)

@AttributeOverrides({
		@AttributeOverride(name = "id", column = @Column(name = "enrollment_id")),
		@AttributeOverride(name = "createdOn", column = @Column(name = "enrolledOn"))
		})
@Getter
@Setter
public class Enrollment extends BaseEntity{
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private User student;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id", nullable = false)
	private Courses course;
}
