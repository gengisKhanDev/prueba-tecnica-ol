-- (1) Contexto y paquete para gestionar el usuario actual
CREATE OR REPLACE CONTEXT app_ctx USING auth_pkg;
/

CREATE OR REPLACE PACKAGE auth_pkg AS
  PROCEDURE set_user(p_user_id NUMBER);
END auth_pkg;
/

CREATE OR REPLACE PACKAGE BODY auth_pkg AS
  PROCEDURE set_user(p_user_id NUMBER) IS
  BEGIN
    DBMS_SESSION.SET_CONTEXT('app_ctx','USER_ID',TO_CHAR(p_user_id));
  END set_user;
END auth_pkg;
/

-- (2) Secuencias para cada tabla
CREATE SEQUENCE usuario_seq       START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE municipio_seq     START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE comerciante_seq   START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE establecimiento_seq START WITH 1 INCREMENT BY 1 NOCACHE;
/

-- (3) Triggers para asignar IDs automáticamente
CREATE OR REPLACE TRIGGER trg_usuario_id
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
  IF :new.id_usuario IS NULL THEN
    SELECT usuario_seq.NEXTVAL INTO :new.id_usuario FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_municipio_id
BEFORE INSERT ON municipio
FOR EACH ROW
BEGIN
  IF :new.id_municipio IS NULL THEN
    SELECT municipio_seq.NEXTVAL INTO :new.id_municipio FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_comerciante_id
BEFORE INSERT ON comerciante
FOR EACH ROW
BEGIN
  IF :new.id_comerciante IS NULL THEN
    SELECT comerciante_seq.NEXTVAL INTO :new.id_comerciante FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_establecimiento_id
BEFORE INSERT ON establecimiento
FOR EACH ROW
BEGIN
  IF :new.id_establecimiento IS NULL THEN
    SELECT establecimiento_seq.NEXTVAL INTO :new.id_establecimiento FROM dual;
  END IF;
END;
/

-- (4) Triggers de auditoría para Comerciante y Establecimiento
CREATE OR REPLACE TRIGGER trg_comerciante_audit
BEFORE INSERT OR UPDATE ON comerciante
FOR EACH ROW
BEGIN
  :new.fecha_actualizacion := SYSTIMESTAMP;
  IF sys_context('app_ctx','USER_ID') IS NOT NULL THEN
    :new.actualizado_por := TO_NUMBER(sys_context('app_ctx','USER_ID'));
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_establecimiento_audit
BEFORE INSERT OR UPDATE ON establecimiento
FOR EACH ROW
BEGIN
  :new.fecha_actualizacion := SYSTIMESTAMP;
  IF sys_context('app_ctx','USER_ID') IS NOT NULL THEN
    :new.actualizado_por := TO_NUMBER(sys_context('app_ctx','USER_ID'));
  END IF;
END;
/