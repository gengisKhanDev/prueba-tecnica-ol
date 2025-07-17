package com.example.demo.common.exception.generics;

import com.example.demo.common.exception.ApiException;
import org.springframework.http.HttpStatus;

//409 Conflict: Conflictos de estado (como duplicación de recursos).
public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
