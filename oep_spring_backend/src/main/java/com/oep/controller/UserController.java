package com.oep.controller;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oep.dtos.LoginDto;
import com.oep.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@Validated
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	
	@PostMapping("/signin")
	@Operation(description = "User Login")
	public ResponseEntity<?> userSignIn(@RequestBody @Valid LoginDto dto){
		System.out.println("In user signin ");
		return ResponseEntity.ok(userService.authenticate(dto));
	}
}
