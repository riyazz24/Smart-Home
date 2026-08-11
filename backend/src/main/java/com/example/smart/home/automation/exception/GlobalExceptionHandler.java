package com.example.smart.home.automation.exception;

import com.example.smart.home.automation.dto.response.ExceptionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final String ALREADY_EXIST;

    public GlobalExceptionHandler(
            @Value("${already.exist}") String ALREADY_EXIST) {
        this.ALREADY_EXIST = ALREADY_EXIST;
    }

    // Handle BadRequestException (HTTP 400)
    @ExceptionHandler({BadRequestException.class, ExpiredOrInvalidException.class})
    public ResponseEntity<ExceptionResponse> handleBadRequest(RuntimeException e) {

        return exceptionResponse(HttpStatus.BAD_REQUEST, e.getMessage());

    }

    // Handle UnauthorizedException (HTTP 401)
    @ExceptionHandler({UnauthorizedException.class})
    public ResponseEntity<?> handleUnauthorized(RuntimeException e) {

        return exceptionResponse(HttpStatus.UNAUTHORIZED, e.getMessage());

    }

    // Handle MfaRequiredException (HTTP 403)
    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<ExceptionResponse> handleForbiddenException(RuntimeException e) {

        return exceptionResponse(HttpStatus.FORBIDDEN, e.getMessage());

    }

    // Handle NotFoundException (HTTP 404)
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleNotFoundException(NotFoundException e) {

        return exceptionResponse(HttpStatus.NOT_FOUND, e.getMessage());

    }

    // Handle ConflictException (HTTP 409)
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ExceptionResponse> handleConflictException(ConflictException e) {

        return exceptionResponse(HttpStatus.CONFLICT, e.getMessage());

    }

    // Handle TooManyRequestException (HTTP 429)
    @ExceptionHandler(TooManyRequestException.class)
    public ResponseEntity<ExceptionResponse> handleTooManyRequestException(TooManyRequestException e) {

        return exceptionResponse(HttpStatus.TOO_MANY_REQUESTS, e.getMessage());

    }

    // Handle EmailSendException (HTTP 503)
    @ExceptionHandler(EmailException.class)
    public ResponseEntity<ExceptionResponse> handleEmailSendException(EmailException e) {

        return exceptionResponse(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());

    }

    // Handle ValidationException
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(MethodArgumentNotValidException e) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return exceptionResponse(HttpStatus.BAD_REQUEST, message);

    }

    // Handle DataIntegrityViolationException
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleDataIntegrityViolationException(DataIntegrityViolationException e) {

        return exceptionResponse(HttpStatus.CONFLICT, ALREADY_EXIST);

    }

    // Handle All Exception (HTTP 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleAll(Exception e) {

        return exceptionResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");

    }

    /**
     * HELPER METHODS
     */
    private ResponseEntity<ExceptionResponse> exceptionResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(new ExceptionResponse(status.value(), status.getReasonPhrase(), message, LocalDateTime.now()));
    }

}