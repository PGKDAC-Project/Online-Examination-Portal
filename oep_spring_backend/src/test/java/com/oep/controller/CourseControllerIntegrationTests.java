package com.oep.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.Courses;
import com.oep.entities.User;
import com.oep.entities.UserRole;
import com.oep.entities.Status;
import jakarta.persistence.EntityManager;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class CourseControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntityManager entityManager;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAllCoursesAdmin() throws Exception {
        Courses course = new Courses();
        course.setTitle("Admin Course");
        course.setCourseCode("AC101");
        course.setDescription("Description");
        entityManager.persist(course);
        entityManager.flush();

        mockMvc.perform(get("/admin/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].title").value("Admin Course"));
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    public void testStudentEnrollmentFlow() throws Exception {
        // Create student
        User student = new User();
        student.setUserName("Student One");
        student.setEmail("student1@example.com");
        student.setRole(UserRole.ROLE_STUDENT);
        student.setStatus(Status.ACTIVE);
        student.setPasswordHash("hash");
        student.setUserCode("S001");
        entityManager.persist(student);

        // Create course
        Courses course = new Courses();
        course.setTitle("Java Basics");
        course.setCourseCode("JB101");
        course.setDescription("Java Basics Description");
        entityManager.persist(course);
        entityManager.flush();

        // Check available courses
        mockMvc.perform(get("/student/courses/available/" + student.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Java Basics"));

        // Enroll
        mockMvc.perform(post("/student/courses/" + course.getId() + "/enroll/" + student.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        // Check enrolled courses
        mockMvc.perform(get("/student/courses/" + student.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Java Basics"));
    }
}
