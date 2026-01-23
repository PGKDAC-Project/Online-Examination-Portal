package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.Courses;

public interface CourseRepository extends JpaRepository<Courses, Long> {

}
