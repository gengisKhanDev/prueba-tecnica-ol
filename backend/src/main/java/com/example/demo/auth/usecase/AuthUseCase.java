package com.example.demo.auth.usecase;

import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.LoginResponse;

public interface AuthUseCase {
    LoginResponse execute(LoginRequest request);
}
