package com.oep.service;

import java.util.List;

import com.oep.dtos.*;
import com.oep.entities.User;

import jakarta.validation.Valid;

public interface UserService {

	void createUser(CreateUserDto dto);

	List<UserResponseDto> getAllUsers();
	
	List<com.oep.dtos.UserResponseDto> getUsersByRole(String role);

	UserResponseDto getUserById(Long id);

	void updateUser(Long id, UpdateUserDto dto);

	void deleteUser(Long id);

}
