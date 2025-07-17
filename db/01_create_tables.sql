-- (1) Tabla de municipios
CREATE TABLE municipio (
  id_municipio      NUMBER         PRIMARY KEY,
  nombre            VARCHAR2(100)  NOT NULL UNIQUE
);

-- (2) Tabla de usuarios
CREATE TABLE usuario (
  id_usuario         NUMBER         PRIMARY KEY,
  nombre             VARCHAR2(100)  NOT NULL,
  correo_electronico VARCHAR2(150)  NOT NULL UNIQUE,
  hash_password      VARCHAR2(255)  NOT NULL,
  rol                VARCHAR2(20)   NOT NULL
                      CHECK (rol IN ('ADMIN','AUXILIAR'))
);

-- (3) Tabla de comerciantes
CREATE TABLE comerciante (
  id_comerciante      NUMBER         PRIMARY KEY,
  nombre              VARCHAR2(200)  NOT NULL,
  id_municipio        NUMBER         NOT NULL,
  telefono            VARCHAR2(20),
  correo_electronico  VARCHAR2(150),
  fecha_registro      DATE           DEFAULT SYSDATE NOT NULL,
  estado              CHAR(1)        DEFAULT 'A' NOT NULL
                      CHECK (estado IN ('A','I')),
  fecha_actualizacion TIMESTAMP,
  actualizado_por     NUMBER,
  CONSTRAINT fk_comerciante_municipio
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio),
  CONSTRAINT fk_comerciante_usuario
    FOREIGN KEY (actualizado_por) REFERENCES usuario(id_usuario)
);

-- Índices Comerciante
CREATE INDEX idx_comerciante_estado    ON comerciante(estado);
CREATE INDEX idx_comerciante_registro ON comerciante(fecha_registro);

-- (4) Tabla de establecimientos
CREATE TABLE establecimiento (
  id_establecimiento  NUMBER         PRIMARY KEY,
  id_comerciante      NUMBER         NOT NULL,
  nombre              VARCHAR2(200)  NOT NULL,
  ingresos            NUMBER(14,2)   DEFAULT 0 NOT NULL,
  num_empleados       NUMBER(10)     DEFAULT 0 NOT NULL,
  fecha_actualizacion TIMESTAMP,
  actualizado_por     NUMBER,
  CONSTRAINT fk_estab_comerciante
    FOREIGN KEY (id_comerciante) REFERENCES comerciante(id_comerciante),
  CONSTRAINT fk_estab_usuario
    FOREIGN KEY (actualizado_por)  REFERENCES usuario(id_usuario)
);

-- Índices
CREATE INDEX idx_estab_comerciante ON establecimiento(id_comerciante);
CREATE INDEX idx_estab_ingresos     ON establecimiento(ingresos);
