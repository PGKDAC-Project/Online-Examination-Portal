package com.oep.dtos;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class CourseResponseDto {
    private Long id;
    private LocalDateTime createdOn;
    private LocalDateTime lastUpdated;
    private String courseCode;
    private String title;
    private String description;
    private List<SyllabusDto> syllabus;
    private InstructorDto instructorDetails;
    private List<String> outcomes;
    private String status;
    
    @Data
    public static class InstructorDto {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
    
    @Data
    public static class SyllabusDto {
        private Long moduleNumber;
        private String moduleTitle;
        private String moduleDescription;
        private Long estimatedHours;
    }
}
