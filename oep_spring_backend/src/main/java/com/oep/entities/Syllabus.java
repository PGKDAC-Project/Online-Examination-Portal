package com.oep.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Syllabus {
	
	@Column(name = "module_number")
	private Long moduleNo;
	
	@Column(name = "module_title", nullable = false)
	private String moduleTitle;
	
	@Column(name = "module_description")
	private String moduleDescription;
	
	@Column(name = "estimated_hours")
	private Long estimatedHrs;
}
