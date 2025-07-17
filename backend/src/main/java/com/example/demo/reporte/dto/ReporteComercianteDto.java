package com.example.demo.reporte.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ReporteComercianteDto {
    private String comerciante;
    private String municipio;
    private String telefono;
    private String correo;
    private LocalDate fechaRegistro;
    private String estado;
    private Integer cantidadEstablecimientos;
    private BigDecimal totalIngresos;
    private Integer cantidadEmpleados;
}
