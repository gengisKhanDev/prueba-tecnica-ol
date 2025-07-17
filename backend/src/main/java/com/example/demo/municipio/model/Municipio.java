package com.example.demo.municipio.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "municipio")
@Data
public class Municipio {
    @Id
    @Column(name = "id_municipio")
    private Long idMunicipio;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;
}
