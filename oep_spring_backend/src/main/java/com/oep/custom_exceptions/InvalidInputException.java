package com.oep.custom_exceptions;

import org.springframework.http.HttpStatus;

public class InvalidInputException extends ApiException {
	public InvalidInputException(String message) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
