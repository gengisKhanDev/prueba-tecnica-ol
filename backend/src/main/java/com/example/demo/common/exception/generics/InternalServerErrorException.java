package com.example.demo.common.exception.generics;

import com.example.demo.common.exception.ApiException;
import org.springframework.http.HttpStatus;

public class InternalServerErrorException extends ApiException {

    public InternalServerErrorException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public InternalServerErrorException(String message, Throwable cause) {
        super(message, cause, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
