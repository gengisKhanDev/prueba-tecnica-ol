package com.example.demo.establecimiento.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ESTABLECIMIENTO")
@Data
public class Establecimiento {

    @Id
    @Column(name = "ID_ESTABLECIMIENTO")
    private Long id;

    @Column(name = "ID_COMERCIANTE", nullable = false)
    private Long idComerciante;

    @Column(name = "NOMBRE", nullable = false)
    private String nombre;

    @Column(name = "INGRESOS", precision = 14, scale = 2, nullable = false)
    private BigDecimal ingresos;

    @Column(name = "NUM_EMPLEADOS", nullable = false)
    private Integer numEmpleados;

    @Column(name = "FECHA_ACTUALIZACION")
    private LocalDateTime fechaActualizacion;

    @Column(name = "ACTUALIZADO_POR")
    private Long actualizadoPor;
}
