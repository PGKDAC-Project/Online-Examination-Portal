package com.oep.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.User;


public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);

	Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);
}
