// 2) src/main/java/com/example/demo/establecimiento/repository/EstablecimientoRepository.java

package com.example.demo.establecimiento.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.establecimiento.model.Establecimiento;

@Repository
public interface EstablecimientoRepository extends JpaRepository<Establecimiento, Long> {

    @Query(
            value = "SELECT COUNT(*) FROM ESTABLECIMIENTO WHERE ID_COMERCIANTE = :idComerciante",
            nativeQuery = true
    )
    long countByIdComerciante(@Param("idComerciante") Long idComerciante);
}
