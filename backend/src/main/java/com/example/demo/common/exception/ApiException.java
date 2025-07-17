package com.example.demo.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class ApiException extends RuntimeException {
    private final HttpStatus status;

    protected ApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    protected ApiException(String message, Throwable cause, HttpStatus status) {
        super(message, cause);
        this.status = status;
    }

}


