package com.oep.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.oep.dtos.CreateUserDto;
import com.oep.entities.Status;
import com.oep.entities.User;
import com.oep.entities.UserRole;

import jakarta.persistence.EntityManager;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class UserControllerIntegrationTests {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private EntityManager entityManager;

        @Test
        @WithMockUser(roles = "ADMIN")
        public void testFullUserLifecycle() throws Exception {
                // 1. Create User
                CreateUserDto dto = new CreateUserDto();
                dto.setName("Lifecycle Test");
                dto.setEmail("lifecycle@example.com");
                dto.setPassword("Pass@123");
                dto.setRole("ROLE_STUDENT");
                dto.setStatus("ACTIVE");
                dto.setBatchId(1L);

                mockMvc.perform(post("/admin/users")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.status").value("success"));

                // 2. Get All Users and verify presence
                mockMvc.perform(get("/admin/users"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray());

                // 3. Update User
                User user = new User();
                user.setUserName("To Update");
                user.setEmail("update@example.com");
                user.setPasswordHash("hash");
                user.setRole(UserRole.ROLE_ADMIN);
                user.setStatus(Status.ACTIVE);
                user.setUserCode("U_UPD");
                entityManager.persist(user);
                entityManager.flush();

                Long id = user.getId();

                dto.setName("Updated Name");
                mockMvc.perform(put("/admin/users/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(dto)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("user updated successfully"));

                // 4. Delete User
                mockMvc.perform(delete("/admin/users/" + id))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("user deleted successfully"));
        }

        @Test
        @WithMockUser(roles = "STUDENT")
        public void testGetStudentProfile() throws Exception {
                User student = new User();
                student.setUserName("Student Profile");
                student.setEmail("profile@example.com");
                student.setPasswordHash("hash");
                student.setRole(UserRole.ROLE_STUDENT);
                student.setStatus(Status.ACTIVE);
                student.setUserCode("S_PROF");
                entityManager.persist(student);
                entityManager.flush();

                mockMvc.perform(get("/student/profile/" + student.getId()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Student Profile"));
        }
}
