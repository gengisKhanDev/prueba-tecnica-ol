-- 1) Especificación del paquete
CREATE OR REPLACE PACKAGE reportes_pkg IS

  -- Tipo de cursor fuerte (ref cursor sin estructura fija)
  TYPE rc_comerciantes IS REF CURSOR;

  -- Función que devuelve el cursor de comerciantes activos
  FUNCTION get_comerciantes_activos
    RETURN rc_comerciantes;

END reportes_pkg;
/
  
-- 2) Cuerpo del paquete
CREATE OR REPLACE PACKAGE BODY reportes_pkg IS

  FUNCTION get_comerciantes_activos
    RETURN rc_comerciantes
  IS
    l_cursor rc_comerciantes;
  BEGIN
    OPEN l_cursor FOR
      SELECT 
        c.nombre                        AS comerciante,
        m.nombre                        AS municipio,
        c.telefono,
        c.correo_electronico            AS correo,
        c.fecha_registro,
        c.estado,
        COUNT(e.id_establecimiento)     AS cantidad_establecimientos,
        NVL(SUM(e.ingresos),0)          AS total_ingresos,
        NVL(SUM(e.num_empleados),0)     AS cantidad_empleados
      FROM comerciante c
      LEFT JOIN establecimiento e 
        ON e.id_comerciante = c.id_comerciante
      JOIN municipio m 
        ON m.id_municipio = c.id_municipio
      WHERE c.estado = 'A'
      GROUP BY 
        c.nombre,
        m.nombre,
        c.telefono,
        c.correo_electronico,
        c.fecha_registro,
        c.estado
      ORDER BY cantidad_establecimientos DESC;

    RETURN l_cursor;
  END get_comerciantes_activos;

END reportes_pkg;
/
