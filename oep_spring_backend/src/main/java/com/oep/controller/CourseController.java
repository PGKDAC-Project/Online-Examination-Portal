package com.oep.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oep.service.CourseService;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/student/course")
@Validated
@RequiredArgsConstructor
public class CourseController {
	private final CourseService courseService;
	
}
