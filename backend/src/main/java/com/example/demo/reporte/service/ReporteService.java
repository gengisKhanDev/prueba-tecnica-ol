package com.example.demo.reporte.service;

import com.example.demo.reporte.dto.ReporteComercianteDto;
import java.util.List;

public interface ReporteService {
    List<ReporteComercianteDto> fetchReporte();
}
