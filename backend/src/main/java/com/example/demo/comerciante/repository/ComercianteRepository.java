package com.example.demo.comerciante.repository;

import com.example.demo.comerciante.model.Comerciante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface ComercianteRepository
        extends JpaRepository<Comerciante, Long>,
        JpaSpecificationExecutor<Comerciante> { }

