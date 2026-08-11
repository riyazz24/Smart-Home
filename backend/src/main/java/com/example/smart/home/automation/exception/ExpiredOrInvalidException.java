package com.example.smart.home.automation.exception;

public class ExpiredOrInvalidException extends RuntimeException {
    public ExpiredOrInvalidException(String message) {
        super(message);
    }
}