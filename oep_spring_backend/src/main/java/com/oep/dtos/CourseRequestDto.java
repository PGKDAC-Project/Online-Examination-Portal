package com.oep.dtos;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.oep.entities.Syllabus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseRequestDto {
    @NotBlank(message = "Course code is required")
    @Size(max = 20, message = "Course code must not exceed 20 characters")
    private String courseCode;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private Set<Long> instructorIds = new HashSet<>(); // Changed to HashSet for uniqueness
    
    private String status; // Optional - will default to ACTIVE if not provided
    
    private List<Syllabus> syllabus;
}
