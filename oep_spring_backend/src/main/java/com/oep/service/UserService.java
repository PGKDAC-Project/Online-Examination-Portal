package com.oep.service;

import com.oep.dtos.AuthResp;
import com.oep.dtos.LoginDto;

import jakarta.validation.Valid;

public interface UserService {

	AuthResp authenticate(LoginDto dto);

}
