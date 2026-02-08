package com.oep.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.http.HttpStatus;

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
		http.csrf(csrf -> csrf.disable());
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.authorizeHttpRequests(request -> request
				// Public endpoints
				.requestMatchers(
						"/auth/signin",
						"/auth/forgot-password",
						"/auth/reset-password/**",
						"/v3/api-docs/**",
						"/swagger-ui/**",
						"/swagger-ui.html")
				.permitAll()
				// Internal API - No authentication (for cross-service communication)
				.requestMatchers("/api/audit-logs").permitAll()
				// Admin APIs
				.requestMatchers("/admin/**").hasRole("ADMIN")
				// Instructor APIs
				.requestMatchers("/instructor/**").hasRole("INSTRUCTOR")
				// Student APIs
				.requestMatchers("/student/**").hasRole("STUDENT")
				// Logs APIs - Admin only
				.requestMatchers("/logs/**").hasRole("ADMIN")
				// All other requests require authentication
				.anyRequest().authenticated());

		http.addFilterBefore(jwtAuthenticationFilter,
				UsernamePasswordAuthenticationFilter.class);

		http.exceptionHandling(ex -> ex
				.authenticationEntryPoint(authenticationEntryPoint()));

		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// Allow local dev and production URL from env var
		// Default to the new Render URL if not set
		String frontendUrl = System.getenv("FRONTEND_URL");
		if (frontendUrl == null) {
			frontendUrl = "https://oep-frontend.onrender.com";
		}

		configuration.setAllowedOrigins(Arrays.asList(
				"http://localhost:5173",
				"http://127.0.0.1:5173",
				frontendUrl,
				"https://online-examination-portal-eight.vercel.app"));
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

	@Bean
	AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> {
			response.setStatus(HttpStatus.UNAUTHORIZED.value());
			response.setContentType("application/json");
			response.getWriter().write("{\"status\":\"Failed\",\"message\":\"Unauthorized\"}");
		};
	}
}
