package com.example.demo.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private Instant timestamp;
    private boolean success;
    private T data;
    private String message;
}
