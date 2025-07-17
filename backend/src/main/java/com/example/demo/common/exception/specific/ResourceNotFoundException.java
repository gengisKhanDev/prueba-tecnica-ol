package com.example.demo.common.exception.specific;

import com.example.demo.common.exception.generics.NotFoundException;

public class ResourceNotFoundException extends NotFoundException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
