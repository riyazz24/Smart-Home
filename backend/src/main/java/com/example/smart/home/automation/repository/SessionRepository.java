package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.dto.response.CreateSessionResponse;
import com.example.smart.home.automation.dto.response.UpdateRefreshTokenResponse;
import com.example.smart.home.automation.model.SessionModel;

import java.time.LocalDateTime;

public interface SessionRepository {

    CreateSessionResponse save(SessionModel model, String cookieRefreshToken);

    void updateSessionIdExpiresAtBySessionId(String sessionId, LocalDateTime sessionIdExpiresAt);

    UpdateRefreshTokenResponse updateRefreshTokeBySessionId(String sessionId, String refreshTokenId, String hashedRefreshToken, LocalDateTime accessTokenExpiresAt,
                                                            LocalDateTime refreshTokenExpiresAt, String cookieRefreshToken);

    void deleteSessionBySessionId(String sessionId);

    SessionModel findSessionBySessionId(String sessionId);

    SessionModel findSessionByRefreshTokenId(String rawRefreshTokenId);

}