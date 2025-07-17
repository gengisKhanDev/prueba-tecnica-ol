package com.example.demo.comerciante.repository;

import com.example.demo.comerciante.model.Comerciante;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ComercianteSpecification {

    public static Specification<Comerciante> nombreContains(String nombre) {
        return (root, q, cb) ->
                nombre == null
                        ? cb.conjunction()
                        : cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
    }

    public static Specification<Comerciante> fechaRegistroEq(LocalDate fecha) {
        return (root, query, cb) -> {
            if (fecha == null) {
                return cb.conjunction();
            }
            // fecha >= fechaRegistro 00:00:00
            var desde = cb.greaterThanOrEqualTo(root.get("fechaRegistro"), fecha);
            // fecha < fechaRegistro + 1 día
            var hasta = cb.lessThan(root.get("fechaRegistro"), fecha.plusDays(1));
            return cb.and(desde, hasta);
        };
    }

    public static Specification<Comerciante> estadoEq(String estado) {
        return (root, q, cb) ->
                estado == null
                        ? cb.conjunction()
                        : cb.equal(root.get("estado"), estado);
    }
}
