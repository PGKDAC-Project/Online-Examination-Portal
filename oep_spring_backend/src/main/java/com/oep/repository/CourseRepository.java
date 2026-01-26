package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.Courses;

public interface CourseRepository extends JpaRepository<Courses, Long> {
    java.util.List<Courses> findByInstructorDetailsId(Long instructorId);

    @org.springframework.data.jpa.repository.Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :studentId")
    java.util.List<Courses> findCoursesByStudentId(
            @org.springframework.data.repository.query.Param("studentId") Long studentId);
}
