package com.example.demo.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PaginatedResponse<T> {
    private int page;               // página actual (0‑based)
    private int size;               // tamaño de página
    private long totalElements;     // total de registros
    private int totalPages;         // total de páginas
    private long offset;            // page * size
    private String next;            // URL de la siguiente página (null si no hay)
    private String previous;        // URL de la página anterior (null si no hay)
    private List<T> content;        // los datos de esta página
}
