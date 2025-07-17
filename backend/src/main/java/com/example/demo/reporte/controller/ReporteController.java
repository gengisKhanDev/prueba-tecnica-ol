package com.example.demo.reporte.controller;

import com.example.demo.reporte.dto.ReporteComercianteDto;
import com.example.demo.reporte.service.ReporteService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService service;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ISO_DATE;

    public ReporteController(ReporteService service) {
        this.service = service;
    }

    @GetMapping(value = "/comerciantes", produces = "text/csv")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StreamingResponseBody> exportCsv() {
        List<ReporteComercianteDto> rows = service.fetchReporte();

        StreamingResponseBody body = out -> {
            try (BufferedWriter w = new BufferedWriter(new OutputStreamWriter(out))) {
                // Header
                w.write("Comerciante|Municipio|Telefono|Correo|FechaRegistro|Estado|CantidadEstablecimientos|TotalIngresos|CantidadEmpleados");
                w.newLine();
                // Filas
                for (var r : rows) {
                    w.write(String.join("|",
                            r.getComerciante(),
                            r.getMunicipio(),
                            r.getTelefono() != null ? r.getTelefono() : "",
                            r.getCorreo()   != null ? r.getCorreo()   : "",
                            r.getFechaRegistro().format(FMT),
                            r.getEstado(),
                            r.getCantidadEstablecimientos().toString(),
                            r.getTotalIngresos().toString(),
                            r.getCantidadEmpleados().toString()
                    ));
                    w.newLine();
                }
                w.flush();
            }
        };

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"reporte_comerciantes.csv\"");
        headers.setContentType(MediaType.parseMediaType("text/csv"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(body);
    }
}
