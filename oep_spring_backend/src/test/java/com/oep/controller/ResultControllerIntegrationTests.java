package com.oep.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oep.entities.Courses;
import com.oep.entities.Exam;
import com.oep.entities.ExamResults;
import com.oep.entities.ExamStatus;
import com.oep.entities.ResultStatus;
import com.oep.entities.Status;
import com.oep.entities.User;
import com.oep.entities.UserRole;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.EntityManager;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ResultControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "STUDENT")
    public void testSubmitAndGetResults() throws Exception {
        // Setup dependencies
        User student = new User();
        student.setUserName("Student Test");
        student.setEmail("student_res@oep.com");
        student.setRole(UserRole.ROLE_STUDENT);
        student.setStatus(Status.ACTIVE);
        student.setPasswordHash("hash");
        student.setUserCode("S101");
        entityManager.persist(student);

        User instructor = new User();
        instructor.setUserName("Instructor Test");
        instructor.setEmail("inst_res@oep.com");
        instructor.setRole(UserRole.ROLE_INSTRUCTOR);
        instructor.setStatus(Status.ACTIVE);
        instructor.setPasswordHash("hash");
        instructor.setUserCode("I101");
        entityManager.persist(instructor);

        Courses course = new Courses();
        course.setTitle("Science");
        course.setCourseCode("SC101");
        course.setDescription("Science Course");
        entityManager.persist(course);

        Exam exam = new Exam();
        exam.setExamTitle("Science Final");
        exam.setCourse(course);
        exam.setInstructorDetails(instructor);
        exam.setStatus(ExamStatus.SCHEDULED);
        exam.setScheduledDate(LocalDate.now());
        exam.setStartTime(LocalTime.of(9, 0));
        exam.setEndTime(LocalTime.of(11, 0));
        exam.setDuration(120);
        exam.setPassingMarks(40);
        entityManager.persist(exam);

        entityManager.flush();

        ExamResults result = new ExamResults();
        result.setStudent(student);
        result.setExam(exam);
        result.setTotalMarks(100);
        result.setTotalScore(85);
        result.setStatus(ResultStatus.PASS);

        // Submit Result
        mockMvc.perform(post("/student/results/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(result)))
                .andExpect(status().isOk());

        // Get personal results
        mockMvc.perform(get("/student/results/" + student.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].totalScore").value(85));
    }
}
