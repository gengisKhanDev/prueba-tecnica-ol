package com.example.demo.comerciante.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ComercianteStateDto {
    @NotBlank
    @Pattern(regexp="[AI]", message="Estado debe ser 'A' o 'I'")
    private String estado;
}
