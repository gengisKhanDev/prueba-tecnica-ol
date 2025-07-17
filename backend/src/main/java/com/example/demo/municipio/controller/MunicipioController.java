package com.example.demo.municipio.controller;

import com.example.demo.common.dto.ApiResponse;
import com.example.demo.municipio.dto.MunicipioDto;
import com.example.demo.municipio.service.MunicipioService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/municipios")
public class MunicipioController {

    private final MunicipioService service;

    public MunicipioController(MunicipioService service) {
        this.service = service;
    }

    @Operation(summary = "Obtener lista de municipios")
    @GetMapping
    public ResponseEntity<ApiResponse<List<MunicipioDto>>> listAll() {
        List<MunicipioDto> dtos = service.getAllMunicipios();
        ApiResponse<List<MunicipioDto>> response =
                new ApiResponse<>(Instant.now(), true, dtos, "Lista de municipios");
        return ResponseEntity.ok(response);
    }
}
