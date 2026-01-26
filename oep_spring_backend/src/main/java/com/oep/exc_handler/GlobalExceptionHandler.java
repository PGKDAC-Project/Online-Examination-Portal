package com.oep.exc_handler;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.oep.custom_exceptions.ApiException;
import com.oep.custom_exceptions.ConflictException;
import com.oep.custom_exceptions.InvalidInputException;
import com.oep.custom_exceptions.ResourceNotFoundException;
import com.oep.custom_exceptions.AuthenticationFailedException;
import com.oep.dtos.ApiResponse;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<?> handleApiException(ApiException e) {
		return ResponseEntity.status(e.getStatus())
				.body(new ApiResponse("Failed", e.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e) {
		System.err.println("Global Exception Caught: " + e.getClass().getName() + " - " + e.getMessage());
		e.printStackTrace();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiResponse("Error", "An unexpected error occurred: " + e.getMessage()));
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<?> handleNoResourceFound(NoResourceFoundException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND)
				.body(new ApiResponse("Failed", "Endpoint not found: " + e.getResourcePath()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		List<FieldError> list = e.getFieldErrors();
		String errorMessage = list.stream()
				.map(FieldError::getDefaultMessage)
				.collect(Collectors.joining(", "));

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse("ValidationFailed", errorMessage));
	}
}
