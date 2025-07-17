# ===== 1) Builder: compila tu JAR con Gradle =====
FROM gradle:8.4-jdk-23-slim AS builder

WORKDIR /home/gradle/project

# Copia solo lo necesario para cachear dependencias
COPY build.gradle settings.gradle gradle.* ./
COPY gradlew ./
COPY gradle ./gradle
RUN chmod +x ./gradlew

# descarga dependencias (capa caché)
RUN ./gradlew --no-daemon dependencies

# Copia el resto del código y construye el JAR
COPY src ./src
RUN ./gradlew --no-daemon bootJar

# ===== 2) Runtime: imagen ligera con JRE =====
FROM eclipse-temurin:23-jre-jammy

LABEL maintainer="harakiriop"

WORKDIR /app

# Copia el JAR empaquetado desde el stage 'builder'
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

# Exponer el puerto de Spring Boot
EXPOSE 8080

# (Opcional) healthcheck para Docker
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Arranque
ENTRYPOINT ["java","-jar","app.jar"]
