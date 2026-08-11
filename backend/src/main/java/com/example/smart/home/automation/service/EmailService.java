package com.example.smart.home.automation.service;

public interface EmailService {

    void send(String toEmail, String subject, String template);

}