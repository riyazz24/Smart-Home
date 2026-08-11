package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRefreshTokenResponse {

    private String cookieRefreshToken;

    private LocalDateTime refreshTokenExpiresAt;

}