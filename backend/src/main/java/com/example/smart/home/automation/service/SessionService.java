package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.CreateSessionResponse;
import com.example.smart.home.automation.dto.response.UpdateRefreshTokenResponse;
import com.example.smart.home.automation.dto.response.ValidateRefreshTokenResponse;
import com.example.smart.home.automation.enums.Role;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface SessionService {

    CreateSessionResponse createSession(String userId, Role role, String deviceId, String userAgent, LocalDateTime accessTokenIssuedAt, LocalDateTime accessTokenExpiresAt);

    UpdateRefreshTokenResponse UpdateRefreshTokenBySessionId(String sessionId, LocalDateTime accessTokenExpiresAt);

    @Transactional
    void validateSession(String sessionId, String deviceId, String userAgent, String cookieRefreshToken);

    ValidateRefreshTokenResponse validateRefreshToken(String deviceId, String userAgent, String cookieRefreshToken);

    void deleteSessionById(String sessionId);

}