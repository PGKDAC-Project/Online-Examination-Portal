package com.oep.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.oep.entities.Courses;

public interface CourseRepository extends JpaRepository<Courses, Long> {
    java.util.List<Courses> findByInstructorDetailsId(Long instructorId);

    @Query("SELECT DISTINCT c FROM Courses c " +
    		"JOIN FETCH c.outcomes o " +
    		"JOIN FETCH c.instructorDetails i " )
    		List<Courses> findCoursesWithOutcomesAndInstructor();
    
    @Query("SELECT e.course FROM Enrollment e WHERE e.student.id = :studentId")
    List<Courses> findCoursesByStudentId(
            @Param("studentId") Long studentId);
}
