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

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

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
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		log.info("********configuring spring sec filter chain*******");
		// disable CSRF protection
		http.csrf(csrf -> csrf.disable());
		// enable CORS with custom configuration source
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		// disable HttpSession creation
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// add url based authentication n authorization rules
		http.authorizeHttpRequests(request ->
		// configure public end points
		request.requestMatchers(
				"/auth/signin",
				"/auth/forgot-password",
				"/auth/reset-password/**",
				"/v3/api-docs/**",
				"/swagger-ui/**",
				"/swagger-ui.html").permitAll()
				.anyRequest().authenticated());

		// Add JWT filter
		http.addFilterBefore(jwtAuthenticationFilter,
				org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setExposedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	// Configure AuthManager as spring bean
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
