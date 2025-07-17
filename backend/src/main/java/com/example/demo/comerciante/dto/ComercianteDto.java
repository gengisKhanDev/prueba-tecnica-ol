package com.example.demo.comerciante.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ComercianteDto {
    private Long id;
    private String nombre;
    private Long idMunicipio;
    private String telefono;
    private String correoElectronico;
    private LocalDate fechaRegistro;
    private String estado;

    private long cantidadEstablecimientos;
}
