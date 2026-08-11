package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSessionResponse {

    private String sessionId;

    private String cookieRefreshToken;

    private LocalDateTime refreshTokenExpiresAt;

}