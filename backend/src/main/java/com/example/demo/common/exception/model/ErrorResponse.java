package com.example.demo.common.exception.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;
/*
* Campos:
timestamp: Fecha y hora en que ocurrió el error.
status: Código de estado HTTP.
error: Mensaje corto del error (por ejemplo, "Bad Request").
message: Detalle del error.
path: Ruta del endpoint que causó el error.
validationErrors: Mapa de errores de validación por campo (opcional, solo para errores de validación).
* */
@Getter
public class ErrorResponse {
    private final LocalDateTime timestamp;
    @Setter
    private int status;
    @Setter
    private String error;
    @Setter
    private String message;
    @Setter
    private String path;
    @Setter
    private Map<String, String> validationErrors; // Opcional: para errores de validación

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters y Setters

}
