package com.example.smart.home.automation.dto.response;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Role role;

    private String accessToken;

    private String sessionId;

    private String cookieRefreshToken;

    private LocalDateTime accessTokenExpiresAt;

    private LocalDateTime refreshTokenExpiresAt;

    private String message;

}