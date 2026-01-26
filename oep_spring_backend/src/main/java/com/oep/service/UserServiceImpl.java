package com.oep.service;

import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.custom_exceptions.InvalidInputException;
import com.oep.dtos.ApiResponse;
import com.oep.dtos.CreateUserDto;
import com.oep.entities.Status;
import com.oep.entities.User;
import com.oep.entities.UserRole;
import com.oep.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void createUser(CreateUserDto dto) {
		String token = UUID.randomUUID().toString() + UUID.randomUUID().toString();
		String userCode = "User@" + String.format("%4d", dto.getBatchId()).substring(1);
		String normalizedEmail = dto.getEmail().toLowerCase();

		if (userRepository.findByEmail(normalizedEmail).isPresent()) {
			throw new InvalidInputException("User with this email already exists");
		}
		User user = modelMapper.map(dto, User.class);
		user.setUserName(dto.getName());
		user.setEmail(normalizedEmail);
		user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
		user.setRole(parseEnum(UserRole.class, dto.getRole()));
		user.setStatus(parseEnum(Status.class, dto.getStatus()));
		user.setActivationToken(token);
		user.setIsFirstLogin(false);
		user.setUserCode(userCode);
		userRepository.save(user);
	}

	@Override
	public java.util.List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@Override
	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new InvalidInputException("User not found"));
	}

	@Override
	public void updateUser(Long id, CreateUserDto dto) {
		User user = userRepository.findById(id).orElseThrow(() -> new InvalidInputException("User not found"));
		user.setUserName(dto.getName());
		user.setEmail(dto.getEmail().toLowerCase());
		user.setRole(parseEnum(UserRole.class, dto.getRole()));
		user.setStatus(parseEnum(Status.class, dto.getStatus()));
		if (dto.getBatchId() != null) {
			user.setBatchId(dto.getBatchId());
		}
		userRepository.save(user);
	}

	@Override
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}

	private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value) {
		try {
			return Enum.valueOf(enumClass, value.toUpperCase());
		} catch (Exception e) {
			throw new InvalidInputException("Invalid value for " + enumClass.getSimpleName() + ": " + value);
		}
	}
}
