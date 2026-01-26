package com.oep.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.oep.entities.Courses;
import com.oep.entities.Enrollment;
import com.oep.entities.Status;
import com.oep.entities.User;
import com.oep.entities.UserRole;

@DataJpaTest
@ActiveProfiles("test")
public class RepositoryTests {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Test
    public void testFindByEmailIgnoreCase() {
        // Given
        User user = new User();
        user.setUserName("Test User");
        user.setEmail("admin@example.com");
        user.setPasswordHash("hash");
        user.setRole(UserRole.ROLE_ADMIN);
        user.setStatus(Status.ACTIVE);
        user.setUserCode("U001");
        entityManager.persist(user);
        entityManager.flush();

        // When
        Optional<User> found = authRepository.findByEmailIgnoreCase("ADMIN@EXAMPLE.COM");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("admin@example.com");
    }

    @Test
    public void testFindCoursesByStudentId() {
        // Given
        User student = new User();
        student.setUserName("Student One");
        student.setEmail("student@example.com");
        student.setPasswordHash("hash");
        student.setRole(UserRole.ROLE_STUDENT);
        student.setStatus(Status.ACTIVE);
        student.setUserCode("S001");
        student = entityManager.persist(student);

        Courses course = new Courses();
        course.setTitle("Java Programming");
        course.setCourseCode("JV101");
        course.setDescription("Learn Java");
        course = entityManager.persist(course);

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        entityManager.persist(enrollment);
        entityManager.flush();

        // When
        List<Courses> courses = courseRepository.findCoursesByStudentId(student.getId());

        // Then
        assertThat(courses).hasSize(1);
        assertThat(courses.get(0).getTitle()).isEqualTo("Java Programming");
    }

    @Test
    public void testExistsByStudentIdAndCourseId() {
        // Given
        User student = new User();
        student.setUserName("Student Two");
        student.setEmail("student2@example.com");
        student.setPasswordHash("hash");
        student.setRole(UserRole.ROLE_STUDENT);
        student.setStatus(Status.ACTIVE);
        student.setUserCode("S002");
        student = entityManager.persist(student);

        Courses course = new Courses();
        course.setTitle("Spring Boot");
        course.setCourseCode("SB202");
        course.setDescription("Learn Spring");
        course = entityManager.persist(course);

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        entityManager.persist(enrollment);
        entityManager.flush();

        // When
        boolean exists = enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId());

        // Then
        assertThat(exists).isTrue();
    }
}
