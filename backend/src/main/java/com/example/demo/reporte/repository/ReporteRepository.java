package com.example.demo.reporte.repository;

import com.example.demo.reporte.dto.ReporteComercianteDto;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.dao.DataAccessException;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Repository
public class ReporteRepository {

    private final SimpleJdbcCall jdbcCall;

    public ReporteRepository(DataSource ds) {
        this.jdbcCall = new SimpleJdbcCall(ds)
                .withCatalogName("reportes_pkg")
                .withFunctionName("get_comerciantes_activos")
                .returningResultSet(
                        "cursor",
                        BeanPropertyRowMapper.newInstance(ReporteComercianteDto.class)
                );
    }

    public List<ReporteComercianteDto> getReporte() {
        try {
            Map<String, Object> out = jdbcCall.execute();
            @SuppressWarnings("unchecked")
            List<ReporteComercianteDto> list =
                    (List<ReporteComercianteDto>) out.get("cursor");
            return list;
        } catch (DataAccessException ex) {
            // será capturado por GlobalExceptionHandler
            throw new RuntimeException("Error al invocar función de reporte", ex);
        }
    }
}
