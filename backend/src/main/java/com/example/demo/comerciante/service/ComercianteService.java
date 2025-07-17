// ComercianteService.java
package com.example.demo.comerciante.service;

import com.example.demo.comerciante.dto.*;
import org.springframework.data.domain.*;

import java.time.LocalDate;

public interface ComercianteService {
    Page<ComercianteDto> list(
            String nombre,
            String estado,
            LocalDate fechaRegistro,
            int page, int size
    );
    ComercianteDto getById(Long id);
    ComercianteDto create(ComercianteRequest req);
    ComercianteDto update(Long id, ComercianteRequest req);
    void delete(Long id);
    ComercianteDto patchState(Long id, ComercianteStateDto stateDto);
}
