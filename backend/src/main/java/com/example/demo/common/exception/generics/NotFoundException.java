package com.example.demo.common.exception.generics;

import com.example.demo.common.exception.ApiException;
import org.springframework.http.HttpStatus;

//404 Not Found: Recursos no encontrados.
public class NotFoundException extends ApiException {
    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
