package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RotateRefreshTokenResponse {

    private String accessToken;

    private String cookieRefreshToken;

    private LocalDateTime accessTokenExpiresAt;

    private LocalDateTime refreshTokenExpiresAt;

}