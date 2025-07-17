package com.example.demo.common.exception.specific;

import com.example.demo.common.exception.generics.ConflictException;

public class UsernameAlreadyExistsException extends ConflictException {
    public UsernameAlreadyExistsException(String message) {
        super(message);
    }
}
