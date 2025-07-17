package com.example.demo.comerciante.service;

import com.example.demo.comerciante.dto.*;
import com.example.demo.comerciante.model.Comerciante;
import com.example.demo.comerciante.repository.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.example.demo.common.exception.generics.NotFoundException;
import com.example.demo.common.exception.generics.ConflictException;
import com.example.demo.establecimiento.repository.EstablecimientoRepository;

import java.time.LocalDate;

@Service
public class ComercianteServiceImpl implements ComercianteService {

    private final ComercianteRepository repo;
    private final EstablecimientoRepository estabRepo;
    public ComercianteServiceImpl(
        ComercianteRepository repo,
        EstablecimientoRepository estabRepo   // <— añadimos al constructor
    ) {
                this.repo      = repo;
                this.estabRepo = estabRepo;
    }

    @Override
    public Page<ComercianteDto> list(String nombre,
                                     String estado,
                                     LocalDate fechaRegistro,
                                     int page, int size) {
        Specification<Comerciante> spec = ComercianteSpecification
                .nombreContains(nombre)
                .and(ComercianteSpecification.estadoEq(estado))
                .and(ComercianteSpecification.fechaRegistroEq(fechaRegistro));
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        return repo.findAll(spec, pageable)
                .map(this::toDto);
    }

    @Override
    public ComercianteDto getById(Long id) {
        return repo.findById(id)
                .map(this::toDto)
                .orElseThrow(() ->
                        new NotFoundException("Comerciante con ID " + id + " no encontrado"));
    }

    @Override
    public ComercianteDto create(ComercianteRequest req) {
        Comerciante ent = new Comerciante();
        fromRequest(ent, req);
        ent = repo.save(ent);
        return toDto(ent);
    }

    @Override
    public ComercianteDto update(Long id, ComercianteRequest req) {
        Comerciante ent = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe comerciante"));
        fromRequest(ent, req);
        ent = repo.save(ent);
        return toDto(ent);
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Comerciante con ID " + id + " no existe");
        }
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException(
                    "No se puede eliminar comerciante con establecimientos activos");
        }
    }

    @Override
    public ComercianteDto patchState(Long id, ComercianteStateDto stateDto) {
        Comerciante ent = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe comerciante"));
        ent.setEstado(stateDto.getEstado());
        ent = repo.save(ent);
        return toDto(ent);
    }

    private ComercianteDto toDto(Comerciante e) {
        ComercianteDto d = new ComercianteDto();
        d.setId(e.getId());
        d.setNombre(e.getNombre());
        d.setIdMunicipio(e.getIdMunicipio());
        d.setTelefono(e.getTelefono());
        d.setCorreoElectronico(e.getCorreoElectronico());
        d.setFechaRegistro(e.getFechaRegistro());
        d.setEstado(e.getEstado());

        long count = estabRepo.countByIdComerciante(e.getId());
        d.setCantidadEstablecimientos(count);
        return d;
    }

    private void fromRequest(Comerciante e, ComercianteRequest r) {
        e.setNombre(r.getNombre());
        e.setIdMunicipio(r.getIdMunicipio());
        e.setTelefono(r.getTelefono());
        e.setCorreoElectronico(r.getCorreoElectronico());
        e.setFechaRegistro(r.getFechaRegistro());
        e.setEstado(r.getEstado());
    }
}
