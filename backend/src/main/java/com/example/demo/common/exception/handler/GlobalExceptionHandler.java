package com.example.demo.common.exception.handler;

import com.example.demo.common.exception.ApiException;
import com.example.demo.common.exception.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Método reutilizable para construir respuestas de error
    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus status, String message, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse();
        error.setStatus(status.value());
        error.setError(status.getReasonPhrase());
        error.setMessage(message);
        error.setPath(request.getRequestURI());
        return new ResponseEntity<>(error, status);
    }

    // Manejo centralizado de todas tus excepciones personalizadas que extiendan ApiException
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        logger.error("ApiException: {}", ex.getMessage());
        return buildErrorResponse(ex.getStatus(), ex.getMessage(), request);
    }

    // Manejo de excepciones de validación (errores en campos @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        logger.error("MethodArgumentNotValidException: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        error.setMessage("Errores de validación en los campos proporcionados.");
        error.setPath(request.getRequestURI());

        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((errorObj) -> {
            String fieldName = ((FieldError) errorObj).getField();
            String errorMessage = errorObj.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });

        error.setValidationErrors(validationErrors);

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Manejar errores por tipo de argumentos incorrectos (tipo de dato inválido)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatchException(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        logger.error("MethodArgumentTypeMismatchException: {}", ex.getMessage());

        String message = String.format("El parámetro '%s' con valor '%s' no es válido.", ex.getName(), ex.getValue());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, message, request);
    }

    // Manejo de excepciones específicas de Spring Security
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        logger.error("BadCredentialsException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Credenciales inválidas.", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        logger.error("AccessDeniedException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acceso denegado.", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        logger.error("AuthenticationException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Error de autenticación.", request);
    }

    // Excepción genérica como última línea de defensa
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        logger.error("Unexpected Exception: {}", ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrió un error inesperado.", request);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateKeyException(DuplicateKeyException ex, HttpServletRequest request) {
        logger.error("DuplicateKeyException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.CONFLICT, "El registro ya existe o genera conflicto en un campo único.", request);
    }


    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessResourceFailure(DataAccessResourceFailureException ex, HttpServletRequest request) {
        logger.error("DataAccessResourceFailureException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "La base de datos no está disponible en este momento.", request);
    }


    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDataAccessApiUsage(InvalidDataAccessApiUsageException ex, HttpServletRequest request) {
        logger.error("InvalidDataAccessApiUsageException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Operación inválida sobre la base de datos.", request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        logger.error("HttpMessageNotReadableException: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es válido o está mal formado.", request);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        logger.error("HttpRequestMethodNotSupportedException: {}", ex.getMessage());
        String message = String.format("El método '%s' no está soportado para este endpoint.", ex.getMethod());
        return buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, message, request);
    }

}
