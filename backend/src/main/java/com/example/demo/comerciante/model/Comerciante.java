package com.example.demo.comerciante.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "comerciante")
@Data
public class Comerciante {
    @Id
    @Column(name = "id_comerciante")
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "id_municipio", nullable = false)
    private Long idMunicipio;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "correo_electronico")
    private String correoElectronico;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "actualizado_por")
    private Long actualizadoPor;
}
