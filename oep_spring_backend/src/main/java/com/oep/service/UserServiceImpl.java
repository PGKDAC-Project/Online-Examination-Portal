package com.oep.service;

import java.util.UUID;

import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import com.oep.dtos.UserResponseDto;
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
		
		String userCode = null;
		
		if(dto.getRole().equalsIgnoreCase("role_student")) {
			userCode = "STU"+dto.getEmail().hashCode();
		}
		else if (dto.getRole().equalsIgnoreCase("role_instructor")) {
			userCode = "INST"+dto.getEmail().hashCode();
		}
		else {
			userCode = "ADM"+dto.getEmail().hashCode();
		}
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
	public java.util.List<UserResponseDto> getAllUsers() {
		return userRepository.findAll().stream()
				.map(user -> {
					UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
					dto.setName(user.getUserName());
					// Format role: ROLE_ADMIN -> Admin
					String formattedRole = user.getRole().name().replace("ROLE_", "");
					formattedRole = formattedRole.substring(0, 1).toUpperCase() + formattedRole.substring(1).toLowerCase();
					dto.setRole(formattedRole);
					// Format status: ACTIVE -> Active
					String formattedStatus = user.getStatus().name();
					formattedStatus = formattedStatus.substring(0, 1).toUpperCase() + formattedStatus.substring(1).toLowerCase();
					dto.setStatus(formattedStatus);
					return dto;
				})
				.collect(Collectors.toList());
	}
	
	@Override
	public java.util.List<UserResponseDto> getUsersByRole(String role) {
		// Handle both "instructor" and "ROLE_INSTRUCTOR" formats
		if (!role.toUpperCase().startsWith("ROLE_")) {
			role = "ROLE_" + role.toUpperCase();
		}
		UserRole userRole = parseEnum(UserRole.class, role);
		return userRepository.findByRole(userRole).stream()
				.map(user -> {
					UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
					dto.setName(user.getUserName());
					// Format role: ROLE_ADMIN -> Admin
					String formattedRole = user.getRole().name().replace("ROLE_", "");
					formattedRole = formattedRole.substring(0, 1).toUpperCase() + formattedRole.substring(1).toLowerCase();
					dto.setRole(formattedRole);
					// Format status: ACTIVE -> Active
					String formattedStatus = user.getStatus().name();
					formattedStatus = formattedStatus.substring(0, 1).toUpperCase() + formattedStatus.substring(1).toLowerCase();
					dto.setStatus(formattedStatus);
					return dto;
				})
				.collect(Collectors.toList());
	}

	@Override
	public UserResponseDto getUserById(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new InvalidInputException("User not found"));
		UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
		dto.setName(user.getUserName());
		// Format role: ROLE_ADMIN -> Admin
		String formattedRole = user.getRole().name().replace("ROLE_", "");
		formattedRole = formattedRole.substring(0, 1).toUpperCase() + formattedRole.substring(1).toLowerCase();
		dto.setRole(formattedRole);
		// Format status: ACTIVE -> Active
		String formattedStatus = user.getStatus().name();
		formattedStatus = formattedStatus.substring(0, 1).toUpperCase() + formattedStatus.substring(1).toLowerCase();
		dto.setStatus(formattedStatus);
		return dto;
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
