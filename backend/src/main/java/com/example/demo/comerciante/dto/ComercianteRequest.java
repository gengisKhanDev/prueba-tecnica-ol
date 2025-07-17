package com.example.demo.comerciante.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ComercianteRequest {

    @NotBlank
    private String nombre;

    @NotNull
    private Long idMunicipio;

    @Pattern(regexp="^\\+?[0-9\\- ]{7,15}$", message="Teléfono inválido")
    private String telefono;

    @Email
    private String correoElectronico;

    @NotNull
    private LocalDate fechaRegistro;

    @NotBlank
    @Pattern(regexp="[AI]", message="Estado debe ser 'A' o 'I'")
    private String estado;
}
