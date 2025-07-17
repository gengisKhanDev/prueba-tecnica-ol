package com.example.demo.municipio.service;

import com.example.demo.municipio.dto.MunicipioDto;
import com.example.demo.municipio.repository.MunicipioRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MunicipioServiceImpl implements MunicipioService {

    private final MunicipioRepository repository;

    public MunicipioServiceImpl(MunicipioRepository repository) {
        this.repository = repository;
    }

    @Override
    @Cacheable("municipios")
    public List<MunicipioDto> getAllMunicipios() {
        return repository.findAll().stream()
                .map(m -> {
                    MunicipioDto dto = new MunicipioDto();
                    dto.setId(m.getIdMunicipio());
                    dto.setNombre(m.getNombre());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
