package com.oep.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.custom_exceptions.AuthenticationFailedException;
import com.oep.dtos.AuthResp;
import com.oep.dtos.LoginDto;
import com.oep.entities.User;
import com.oep.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	
	@Override
	public AuthResp authenticate(LoginDto dto) {
		User user=userRepository.findByEmailAndPasswordHash(dto.getEmail(), dto.getPassword())
				.orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));
		AuthResp authDto = modelMapper.map(user, AuthResp.class);
		return authDto;
	}

}
