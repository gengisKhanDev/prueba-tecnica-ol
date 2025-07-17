# Prueba Técnica Full-Stack

Este repositorio contiene:

- **database/**: scripts PLSQL para crear tablas, secuencias, triggers y datos de prueba.  
- **backend/**: API Spring Boot con Dockerfile.  
- **frontend/**: App Next.js + React con llamadas a la API.  
- **docker-compose.yml** para levantar todo en un solo comando.

---

## Requisitos

- Docker & Docker‑Compose  
- JDK 23 (si no usas Docker)  
- Node.js 18+ (si no usas Docker para frontend)  

---

## 1. Base de datos Oracle XE 21c con Docker

```bash
docker run -d --name oracle21c \
  -p 1521:1521 -p 5500:5500 \
  -e ORACLE_PASSWORD=Password123 \
  -v oracle-volume:/opt/oracle/XE21CFULL/oradata \
  gvenzl/oracle-xe:21-full
