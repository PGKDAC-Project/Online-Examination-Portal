package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.oep.entities.User;
import com.oep.entities.UserRole;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	List<User> findByRole(UserRole role);
}
