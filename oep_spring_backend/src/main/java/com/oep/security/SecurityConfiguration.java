package com.oep.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration // To declare a java config class (equivalent to bean config xml file)
@EnableWebSecurity // to enable spring security
@EnableMethodSecurity // optional to add method level authorization rules
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {
	// ctor based D.I
	private final PasswordEncoder passwordEncoder;

	/*
	 * Configure Spring sec filter chain as a spring bean (@Bean) , to override the
	 * spring sec defaults - Disable CSRF protection - Disable HttpSession - Disable
	 * login / logout page generation (i.e disable form login) - retain Basic
	 * Authentication scheme. - Add authorization rules - swagger , sign in , sign
	 * up , listing doctors.. - public end points - any other request - authenticate
	 * Add HttpSecurity as the dependency - to build sec filter chain
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		log.info("********configuring spring sec filter chain*******");
		// disable CSRF protection
		http.csrf(csrf -> csrf.disable());
		// disable HttpSession creation
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// add url based authentication n authorization rules
		http.authorizeHttpRequests(request ->
//configure public end points
		request.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-resources/**", "/webjars/**", "/users/signin", "/forgot-password", 
				"/users/pwd-encryption").permitAll()
				.anyRequest().authenticated());
		return http.build();
	}

	// Configure AuthManager as spring bean
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
