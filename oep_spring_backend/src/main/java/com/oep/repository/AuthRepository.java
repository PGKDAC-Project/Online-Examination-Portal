package com.oep.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.User;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;



public interface AuthRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	Optional<User> findByActivationToken(String token);
	//Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);
	
	
	
	
}
