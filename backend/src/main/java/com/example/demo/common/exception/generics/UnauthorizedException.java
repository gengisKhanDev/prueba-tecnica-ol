package com.example.demo.common.exception.generics;

import com.example.demo.common.exception.ApiException;
import org.springframework.http.HttpStatus;

//401 Unauthorized: Problemas de autenticación.
public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
