package com.example.smart.home.automation.security.authentication;

import com.example.smart.home.automation.security.authentication.dto.response.AuthenticateResponse;

public interface AuthenticateService {

    AuthenticateResponse authenticate(String email, String rawPassword);

}