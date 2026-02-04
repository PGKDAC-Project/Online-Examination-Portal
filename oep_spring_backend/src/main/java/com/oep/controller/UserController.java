package com.oep.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.oep.dtos.ApiResponse;
import com.oep.dtos.CreateUserDto;
import com.oep.dtos.UpdateUserDto;
import com.oep.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	
	@GetMapping("/admin/users")
	@Operation(description = "Get all the users.")
	public ResponseEntity<?> getAllUsers(@org.springframework.web.bind.annotation.RequestParam(required = false) String role) {
		if (role != null && !role.isEmpty()) {
			return ResponseEntity.ok(userService.getUsersByRole(role));
		}
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/admin/users/{id}")
	@Operation(description = "Get User by Id.")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@PostMapping("/admin/users")
	@Operation(description = "Add new user, post request coming from .Net Admin Service.")
	public ResponseEntity<?> createUser(@RequestBody @Valid CreateUserDto dto) {
		userService.createUser(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("success", "user created successfully"));
	}

	@PutMapping("/admin/users/{id}")
	@Operation(description = "Update User")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserDto dto) {
		userService.updateUser(id, dto);
		return ResponseEntity.ok(new ApiResponse("success", "user updated successfully"));
	}

	@DeleteMapping("/admin/users/{id}")
	@Operation(description = "Delete User")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.ok(new ApiResponse("success", "user deleted successfully"));
	}

	@GetMapping("/instructor/profile/{id}")
	public ResponseEntity<?> getInstructorProfile(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@GetMapping("/student/profile/{id}")
	public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}
}
