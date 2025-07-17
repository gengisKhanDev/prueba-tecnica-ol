package com.example.demo.common.exception.generics;

import com.example.demo.common.exception.ApiException;
import org.springframework.http.HttpStatus;

//400 Bad Request: Errores de validación o solicitudes mal formadas.
public class BadRequestException extends ApiException {
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
