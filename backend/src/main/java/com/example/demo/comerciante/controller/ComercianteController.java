package com.example.demo.comerciante.controller;

import com.example.demo.common.dto.ApiResponse;
import com.example.demo.comerciante.dto.*;
import com.example.demo.comerciante.service.ComercianteService;
import com.example.demo.common.dto.PaginatedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/comerciantes")
public class ComercianteController {

    private final ComercianteService service;

    public ComercianteController(ComercianteService service) {
        this.service = service;
    }

    @Operation(summary = "Listar comerciantes (paginado y filtrado)")
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<ComercianteDto>>> list(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String estado,
            @RequestParam(
                    required = false,
                    name = "fechaRegistro"
            )
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaRegistro,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        // 1) Llamamos al servicio que devuelve Page<ComercianteDto>
        Page<ComercianteDto> result = service.list(
                nombre,
                estado,
                fechaRegistro,
                page,
                size
        );

        // 2) Creamos los metadatos
        int currentPage    = result.getNumber();
        int totalPages     = result.getTotalPages();
        long totalElements = result.getTotalElements();
        long offset        = (long) currentPage * size;

        // 3) Construimos URLs next/previous
        String baseUrl = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .replaceQueryParam("page")
                .replaceQueryParam("size")
                .toUriString();

        String next = currentPage < totalPages - 1
                ? UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("page", currentPage + 1)
                .queryParam("size", size)
                .toUriString()
                : null;

        String previous = currentPage > 0
                ? UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("page", currentPage - 1)
                .queryParam("size", size)
                .toUriString()
                : null;

        // 4) Montamos el PaginatedResponse
        PaginatedResponse<ComercianteDto> pageDto = new PaginatedResponse<>(
                currentPage,
                size,
                totalElements,
                totalPages,
                offset,
                next,
                previous,
                result.getContent()
        );

        // 5) Devolvemos usando ApiResponse
        ApiResponse<PaginatedResponse<ComercianteDto>> response =
                new ApiResponse<>(Instant.now(), true, pageDto, "Lista paginada de comerciantes");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener comerciante por ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComercianteDto>> getById(@PathVariable Long id) {
        ComercianteDto dto = service.getById(id);
        return ResponseEntity.ok(new ApiResponse<>(Instant.now(), true, dto, "Comerciante encontrado"));
    }

    @Operation(summary = "Crear nuevo comerciante")
    @PostMapping
    public ResponseEntity<ApiResponse<ComercianteDto>> create(
            @RequestBody @Valid ComercianteRequest req
    ) {
        ComercianteDto dto = service.create(req);
        return ResponseEntity.status(201)
                .body(new ApiResponse<>(Instant.now(), true, dto, "Comerciante creado"));
    }

    @Operation(summary = "Actualizar comerciante")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComercianteDto>> update(
            @PathVariable Long id,
            @RequestBody @Valid ComercianteRequest req
    ) {
        ComercianteDto dto = service.update(id, req);
        return ResponseEntity.ok(new ApiResponse<>(Instant.now(), true, dto, "Comerciante actualizado"));
    }

    @Operation(summary = "Eliminar comerciante (solo ADMIN)")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(Instant.now(), true, null, "Comerciante eliminado"));
    }

    @Operation(summary = "Cambiar estado de comerciante")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<ComercianteDto>> patchState(
            @PathVariable Long id,
            @RequestBody @Valid ComercianteStateDto req
    ) {
        ComercianteDto dto = service.patchState(id, req);
        return ResponseEntity.ok(new ApiResponse<>(Instant.now(), true, dto, "Estado actualizado"));
    }
}
