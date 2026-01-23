package com.oep.dtos;

import com.oep.entities.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//user id ,name, email , role , message
@AllArgsConstructor
public class AuthResp {
//	private Long id;	
//	private String userName;	
	private String jwt;	
//	private UserRole role;
	private String message;
	
}
