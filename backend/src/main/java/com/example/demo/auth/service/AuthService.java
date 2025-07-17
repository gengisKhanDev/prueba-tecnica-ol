package com.example.demo.auth.service;

import com.example.demo.auth.dto.LoginRequest;
import com.example.demo.auth.dto.LoginResponse;
import com.example.demo.auth.model.Usuario;
import com.example.demo.auth.repository.UsuarioRepository;
import com.example.demo.auth.usecase.AuthUseCase;
import com.example.demo.common.exception.generics.UnauthorizedException;
import com.example.demo.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements AuthUseCase {

    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtProvider;

    public AuthService(UsuarioRepository repo,
                       PasswordEncoder encoder,
                       JwtTokenProvider jwtProvider) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtProvider = jwtProvider;
    }

    @Override
    public LoginResponse execute(LoginRequest req) {
        Usuario user = repo.findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new UnauthorizedException("Usuario o contraseña inválidos"));
        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Usuario o contraseña inválidos");
        }
        String token = jwtProvider.createToken(user.getEmail(), user.getRol());
        return new LoginResponse(token, user.getEmail());
    }
}