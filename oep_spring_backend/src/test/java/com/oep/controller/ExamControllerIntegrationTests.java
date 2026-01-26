package com.oep.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

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
import com.oep.entities.ExamStatus;
import com.oep.entities.User;
import com.oep.entities.UserRole;
import com.oep.entities.Status;
import jakarta.persistence.EntityManager;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ExamControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = "STUDENT")
    public void testExamPasswordValidation() throws Exception {
        // Setup dependencies
        User instructor = new User();
        instructor.setUserName("Instructor");
        instructor.setEmail("inst@oep.com");
        instructor.setRole(UserRole.ROLE_INSTRUCTOR);
        instructor.setStatus(Status.ACTIVE);
        instructor.setPasswordHash("hash");
        instructor.setUserCode("I001");
        entityManager.persist(instructor);

        Courses course = new Courses();
        course.setTitle("Math");
        course.setCourseCode("M101");
        course.setDescription("Math Course");
        entityManager.persist(course);

        Exam exam = new Exam();
        exam.setExamTitle("Final Exam");
        exam.setCourse(course);
        exam.setInstructorDetails(instructor);
        exam.setExamPassword("secret123");
        exam.setStatus(ExamStatus.SCHEDULED);
        exam.setScheduledDate(LocalDate.now());
        exam.setStartTime(LocalTime.of(10, 0));
        exam.setEndTime(LocalTime.of(12, 0));
        exam.setDuration(120);
        exam.setPassingMarks(40);
        entityManager.persist(exam);
        entityManager.flush();

        // Test wrong password
        Map<String, String> wrongPayload = new HashMap<>();
        wrongPayload.put("password", "wrong");

        mockMvc.perform(post("/student/exams/" + exam.getId() + "/verify-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(wrongPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("failed"));

        // Test correct password
        Map<String, String> correctPayload = new HashMap<>();
        correctPayload.put("password", "secret123");

        mockMvc.perform(post("/student/exams/" + exam.getId() + "/verify-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(correctPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        // Test /submissions with password
        mockMvc.perform(post("/student/exams/" + exam.getId() + "/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(correctPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Exam access granted"));

        mockMvc.perform(post("/student/exams/" + exam.getId() + "/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(wrongPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("failed"));
    }
}
