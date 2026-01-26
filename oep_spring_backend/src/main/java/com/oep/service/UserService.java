package com.oep.service;

import com.oep.dtos.CreateUserDto;

import jakarta.validation.Valid;

public interface UserService {

	void createUser(CreateUserDto dto);

	java.util.List<com.oep.entities.User> getAllUsers();

	com.oep.entities.User getUserById(Long id);

	void updateUser(Long id, CreateUserDto dto);

	void deleteUser(Long id);

}
