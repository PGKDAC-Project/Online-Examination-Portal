package com.oep.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.User;
import com.oep.repository.AuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
// @Slf4j
public class CustomUserDetailsServiceImpl implements UserDetailsService {
	private final AuthRepository authRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		// log.info("********* in load user ");
		User user = authRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new UsernameNotFoundException("User by this email doesn't exist!"));
		// email verified
		return new UserPrincipal(user.getId(),
				user.getEmail(), user.getPasswordHash(),
				List.of(new SimpleGrantedAuthority(user.getRole().name())), user.getRole().name());
	}

}
