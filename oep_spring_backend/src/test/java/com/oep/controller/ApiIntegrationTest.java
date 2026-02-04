package com.oep.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oep.dtos.*;
import com.oep.entities.*;
import com.oep.repository.*;
import com.oep.service.EmailService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Set;

import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ApiIntegrationTest {

    @MockBean
    private EmailService emailService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static String adminToken;
    private static String instructorToken;
    private static String studentToken;
    private static Long adminId;
    private static Set<Long> instructorId;
    private static Long studentId;
    private static Long courseId;

    @BeforeEach
    void setup() {
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User();
            admin.setUserName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(UserRole.ROLE_ADMIN);
            admin.setStatus(Status.ACTIVE);
            admin.setUserCode("ADM001");
            admin = userRepository.save(admin);
            adminId = admin.getId();

            // Create instructor user
            User instructor = new User();
            instructor.setUserName("Instructor User");
            instructor.setEmail("instructor@test.com");
            instructor.setPasswordHash(passwordEncoder.encode("Inst@123"));
            instructor.setRole(UserRole.ROLE_INSTRUCTOR);
            instructor.setStatus(Status.ACTIVE);
            instructor.setUserCode("INS001");
            instructor = userRepository.save(instructor);
            //instructorId = instructor.getId();

            // Create student user
            User student = new User();
            student.setUserName("Student User");
            student.setEmail("student@test.com");
            student.setPasswordHash(passwordEncoder.encode("Stud@123"));
            student.setRole(UserRole.ROLE_STUDENT);
            student.setStatus(Status.ACTIVE);
            student.setUserCode("STU001");
            student = userRepository.save(student);
            studentId = student.getId();
        }
    }

    // ==================== Authentication Tests ====================

    @Test
    @Order(1)
    void testLoginSuccess() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("admin@test.com");
        loginDto.setPassword("Admin@123");

        MvcResult result = mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.role").value("admin"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResp authResp = objectMapper.readValue(response, AuthResp.class);
        adminToken = authResp.getToken();
    }

    @Test
    @Order(2)
    void testLoginInstructorSuccess() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("instructor@test.com");
        loginDto.setPassword("Inst@123");

        MvcResult result = mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResp authResp = objectMapper.readValue(response, AuthResp.class);
        instructorToken = authResp.getToken();
    }

    @Test
    @Order(3)
    void testLoginStudentSuccess() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("student@test.com");
        loginDto.setPassword("Stud@123");

        MvcResult result = mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResp authResp = objectMapper.readValue(response, AuthResp.class);
        studentToken = authResp.getToken();
    }

    @Test
    void testLoginValidationFailure_MissingEmail() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setPassword("Admin@123");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    @Test
    void testLoginValidationFailure_InvalidEmail() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("invalid-email");
        loginDto.setPassword("Admin@123");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    @Test
    void testLoginAuthenticationFailure() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("admin@test.com");
        loginDto.setPassword("WrongPassword");

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized());
    }

    // ==================== User Management Tests ====================

    @Test
    @Order(4)
    void testGetAllUsers_AdminSuccess() throws Exception {
        mockMvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void testGetAllUsers_UnauthorizedWithoutToken() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetAllUsers_ForbiddenForStudent() throws Exception {
        mockMvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(5)
    void testCreateUser_AdminSuccess() throws Exception {
        CreateUserDto dto = new CreateUserDto();
        dto.setName("New User");
        dto.setEmail("newuser@test.com");
        dto.setPassword("Pass@123");
        dto.setRole("ROLE_STUDENT");
        dto.setStatus("ACTIVE");

        mockMvc.perform(post("/admin/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void testCreateUser_ValidationFailure_MissingName() throws Exception {
        CreateUserDto dto = new CreateUserDto();
        dto.setEmail("test@test.com");
        dto.setPassword("Pass@123");
        dto.setRole("ROLE_STUDENT");
        dto.setStatus("ACTIVE");

        mockMvc.perform(post("/admin/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    @Test
    void testCreateUser_ValidationFailure_InvalidEmail() throws Exception {
        CreateUserDto dto = new CreateUserDto();
        dto.setName("Test User");
        dto.setEmail("invalid-email");
        dto.setPassword("Pass@123");
        dto.setRole("ROLE_STUDENT");
        dto.setStatus("ACTIVE");

        mockMvc.perform(post("/admin/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    // ==================== Course Management Tests ====================

    @Test
    @Order(6)
    void testCreateCourse_AdminSuccess() throws Exception {
        CourseRequestDto dto = new CourseRequestDto();
        dto.setCourseCode("CS101");
        dto.setTitle("Introduction to Computer Science");
        dto.setDescription("Basic CS course");
        dto.setInstructorIds(instructorId);

        MvcResult result = mockMvc.perform(post("/admin/courses")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseCode").value("CS101"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        Courses course = objectMapper.readValue(response, Courses.class);
        courseId = course.getId();
    }

    @Test
    void testCreateCourse_ValidationFailure_MissingTitle() throws Exception {
        CourseRequestDto dto = new CourseRequestDto();
        dto.setCourseCode("CS102");
        dto.setInstructorIds(instructorId);

        mockMvc.perform(post("/admin/courses")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    @Test
    void testCreateCourse_ValidationFailure_MissingInstructorId() throws Exception {
        CourseRequestDto dto = new CourseRequestDto();
        dto.setCourseCode("CS103");
        dto.setTitle("Test Course");

        mockMvc.perform(post("/admin/courses")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ValidationFailed"));
    }

    @Test
    @Order(7)
    void testGetAllCourses_AdminSuccess() throws Exception {
        mockMvc.perform(get("/admin/courses")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testGetAllCourses_ForbiddenForStudent() throws Exception {
        mockMvc.perform(get("/admin/courses")
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    // ==================== Authorization Tests ====================

    @Test
    void testAdminEndpoint_ForbiddenForInstructor() throws Exception {
        mockMvc.perform(get("/admin/users")
                .header("Authorization", "Bearer " + instructorToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testInstructorEndpoint_ForbiddenForStudent() throws Exception {
        mockMvc.perform(get("/instructor/courses/" + instructorId)
                .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testStudentEndpoint_ForbiddenForInstructor() throws Exception {
        mockMvc.perform(get("/student/courses/" + studentId)
                .header("Authorization", "Bearer " + instructorToken))
                .andExpect(status().isForbidden());
    }

    // ==================== Public Endpoint Tests ====================

    @Test
    void testSwaggerUI_PublicAccess() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    void testApiDocs_PublicAccess() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }
}
