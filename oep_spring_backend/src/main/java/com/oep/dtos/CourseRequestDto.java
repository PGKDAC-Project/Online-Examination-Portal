package com.oep.dtos;

import java.util.List;
import com.oep.entities.Syllabus;
import lombok.Data;

@Data
public class CourseRequestDto {
    private String courseCode;
    private String title;
    private String description;
    private Long instructorId;
    private List<Syllabus> syllabus;
}
