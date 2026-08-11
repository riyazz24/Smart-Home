package com.example.smart.home.automation.model;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class SessionModel {

    private String sessionId;

    private String userId;

    private Role role;

    private String deviceId;

    private String userAgent;

    private String refreshTokenId;

    private String hashedRefreshToken;

    private LocalDateTime accessTokenExpiresAt;

    private LocalDateTime sessionIdExpiresAt;

    private LocalDateTime refreshTokenExpiresAt;

}