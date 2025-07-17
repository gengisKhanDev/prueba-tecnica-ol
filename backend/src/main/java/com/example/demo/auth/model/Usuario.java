package com.example.demo.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Data @NoArgsConstructor @AllArgsConstructor
public class Usuario {
    @Id
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "correo_electronico", nullable = false, unique = true)
    private String email;

    @Column(name = "hash_password", nullable = false)
    private String password;

    @Column(name = "rol", nullable = false)
    private String rol;
}