package com.example.demo.reporte.service;

import com.example.demo.reporte.dto.ReporteComercianteDto;
import com.example.demo.reporte.repository.ReporteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReporteServiceImpl implements ReporteService {

    private final ReporteRepository repo;

    public ReporteServiceImpl(ReporteRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<ReporteComercianteDto> fetchReporte() {
        return repo.getReporte();
    }
}
