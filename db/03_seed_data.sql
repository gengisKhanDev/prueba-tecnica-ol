
-- 1) Inserción de usuarios
INSERT INTO usuario (nombre, correo_electronico, hash_password, rol)
VALUES ('Administrador',    'admin@admin.com',   'Password123', 'ADMIN');

INSERT INTO usuario (nombre, correo_electronico, hash_password, rol)
VALUES ('Auxiliar Registro','aux@aux.com',     'Password123', 'AUXILIAR');

COMMIT;

-- 2) Inserción de municipios
INSERT INTO municipio (nombre) VALUES ('Bogotá');
INSERT INTO municipio (nombre) VALUES ('Medellín');
INSERT INTO municipio (nombre) VALUES ('Cali');
INSERT INTO municipio (nombre) VALUES ('Barranquilla');
INSERT INTO municipio (nombre) VALUES ('Cartagena');

COMMIT;

-- 3) Fijar contexto de auditoría como Administrador (id_usuario = 1)
BEGIN
  auth_pkg.set_user(1);
END;
/

-- 4) Inserción de comerciantes
-- Se insertan 5 comerciantes distintos
INSERT INTO comerciante (nombre, id_municipio, telefono, correo_electronico)
VALUES ('Comerciante Uno',   1, '3001234567', 'c1@comercio.com');

INSERT INTO comerciante (nombre, id_municipio, telefono, correo_electronico)
VALUES ('Comerciante Dos',   2, '3002345678', 'c2@comercio.com');

INSERT INTO comerciante (nombre, id_municipio, telefono, correo_electronico)
VALUES ('Comerciante Tres',  3, NULL,         'c3@comercio.com');

INSERT INTO comerciante (nombre, id_municipio, telefono, correo_electronico)
VALUES ('Comerciante Cuatro',4, '3004567890', NULL);

INSERT INTO comerciante (nombre, id_municipio, telefono, correo_electronico)
VALUES ('Comerciante Cinco', 5, NULL,         NULL);

COMMIT;

-- 5) Inserción de establecimientos (2 por comerciante)
INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (1, 'Establecimiento 1‑A', 12500.50,  10);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (1, 'Establecimiento 1‑B',  8500.00,   8);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (2, 'Establecimiento 2‑A', 20000.75,  15);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (2, 'Establecimiento 2‑B',  5000.00,   5);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (3, 'Establecimiento 3‑A', 15000.25,  12);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (3, 'Establecimiento 3‑B',  7200.00,   7);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (4, 'Establecimiento 4‑A', 30000.00,  20);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (4, 'Establecimiento 4‑B', 10000.10,   9);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (5, 'Establecimiento 5‑A',  9500.00,   6);

INSERT INTO establecimiento (id_comerciante, nombre, ingresos, num_empleados)
VALUES (5, 'Establecimiento 5‑B',  4300.50,   4);

COMMIT;
