package com.oep.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration //To declare a java config class (equivalent to bean config xml file)
@EnableWebSecurity //to enable spring security
@EnableMethodSecurity //optional to add method level authorization rules
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {
	private final PasswordEncoder passwordEncoder;
/*
 * Configure Spring sec filter chain as a spring bean (@Bean) , to override the spring sec defaults
 * - Disable CSRF protection
 * - Disable HttpSession 
 * - Disable login / logout page generation (i.e disable form login)
 * - retain Basic Authentication scheme.
 * - Add authorization rules 
 *  - swagger , sign in , sign up , listing doctors.. 
 *   - public end points
 *  - any other request
 *   - authenticate
 *  Add HttpSecurity  as the dependency
 *   - to build sec filter chain
 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		//disable CSRF protection
		http.csrf(csrf->csrf.disable());
		//disable HttpSession creation 
		http.sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		//enable Basic Auth support (to be kept only till JWT)
		http.httpBasic(Customizer.withDefaults());
		//add url based authentication rules 
		http.authorizeHttpRequests(request ->
//configure public end points
		request.requestMatchers("/v3/api-docs/**","/swagger-ui/**","/users/signin","/doctors/signup","/patients/signup").permitAll()
		//For HTTP method - GET , to access all doctors - public
		.requestMatchers(HttpMethod.GET, "/doctors").permitAll()
		//only admin should be able to see all patients and all appointments info
		.requestMatchers("/admin/*").hasRole("ADMIN")
		//authenticate any other remaining request
		.anyRequest().authenticated()
		);
		return http.build();
	}
	
	///configure UseDetailsService (to fetch user details from data store -InMemory)
	@Bean
	UserDetailsService userDetailsService() {
		//1. Create UserDetails <--User
		//(name, password, Collection<GrantedAuthority> authorities)
		User admin = new User("Arkkseies967@gmail.com", passwordEncoder.encode("ankit123"), List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
		User patient = new User("sanju@gmail.com", passwordEncoder.encode("*k|ZJ+Wb7G/-C"), List.of(new SimpleGrantedAuthority("ROLE_PATIENT")));
		User doctor = new User("dr.sonal@medcare.com", passwordEncoder.encode("doc123"), List.of(new SimpleGrantedAuthority("ROLE_DOCTOR")));

		//create instance of implementation class to  load user details from memory.
		InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
		return manager;
	}
}
