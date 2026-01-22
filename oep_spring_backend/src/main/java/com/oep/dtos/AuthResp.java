package com.oep.dtos;

import com.oep.entities.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//user id ,name, email , role , message
public class AuthResp {
	private Long id;	
	private String name;	
	private String email;	
	private UserRole role;
	private String message;
	
}
