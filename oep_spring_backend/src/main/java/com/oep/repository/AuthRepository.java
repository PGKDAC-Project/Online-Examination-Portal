package com.oep.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.User;

public interface AuthRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);

	Optional<User> findByEmailIgnoreCase(String email);

	Optional<User> findByActivationToken(String token);
}
