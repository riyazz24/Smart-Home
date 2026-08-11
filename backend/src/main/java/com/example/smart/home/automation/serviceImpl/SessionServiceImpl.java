package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.CreateSessionResponse;
import com.example.smart.home.automation.dto.response.UpdateRefreshTokenResponse;
import com.example.smart.home.automation.dto.response.ValidateRefreshTokenResponse;
import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.model.SessionModel;
import com.example.smart.home.automation.repository.SessionRepository;
import com.example.smart.home.automation.service.SessionService;
import com.example.smart.home.automation.util.Helper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SessionServiceImpl implements SessionService {

    private final long activeSessionDuration;
    private final long refreshTokenDuration;
    private final SessionRepository sessionRepository;
    private final Helper helper;

    public SessionServiceImpl(
            @Value("${active.session.duration}") long activeSessionDuration,
            @Value("${refresh.token.duration}") long refreshTokenDuration,
            SessionRepository sessionRepository,
            Helper helper) {
        this.activeSessionDuration = activeSessionDuration;
        this.refreshTokenDuration = refreshTokenDuration;
        this.sessionRepository = sessionRepository;
        this.helper = helper;
    }

    @Override
    public CreateSessionResponse createSession(String userId, Role role, String deviceId, String userAgent, LocalDateTime accessTokenIssuedAt, LocalDateTime accessTokenExpiresAt) {

        long issuedTime = Helper.currentTimeInEpochMilli();
        long sessionIdExpiresTime = Helper.expireTimeInEpochMilli(issuedTime, activeSessionDuration);
        long refreshTokenExpiresTime = Helper.expireTimeInEpochMilli(issuedTime, refreshTokenDuration);

        String[] refreshTokenArray = Helper.getRefreshTokenArray();

        String refreshTokenId = refreshTokenArray[0];
        String rawRefreshToken = refreshTokenArray[1];
        String cookieRefreshToken = refreshTokenArray[2];

        SessionModel model = SessionModel.builder()
                .sessionId(Helper.getRandomStringOfLength32())
                .userId(userId)
                .role(role)
                .userAgent(userAgent)
                .deviceId(deviceId)
                .refreshTokenId(refreshTokenId)
                .hashedRefreshToken(helper.toHash(rawRefreshToken))
                .accessTokenExpiresAt((accessTokenExpiresAt))
                .sessionIdExpiresAt(Helper.toLocalDateTime(sessionIdExpiresTime))
                .refreshTokenExpiresAt(Helper.toLocalDateTime(refreshTokenExpiresTime))
                .build();

        return sessionRepository.save(model, cookieRefreshToken);

    }

    @Override
    public UpdateRefreshTokenResponse UpdateRefreshTokenBySessionId(String sessionId, LocalDateTime accessTokenExpiresAt) {

        long issuedTime = Helper.currentTimeInEpochMilli();
        long newRefreshTokenExpiresTime = Helper.expireTimeInEpochMilli(issuedTime, refreshTokenDuration);

        String[] refreshTokenArray = Helper.getRefreshTokenArray();

        String refreshTokenId = refreshTokenArray[0];
        String rawRefreshToken = refreshTokenArray[1];
        String cookieRefreshToken = refreshTokenArray[2];

        return sessionRepository.updateRefreshTokeBySessionId(sessionId, refreshTokenId, helper.toHash(rawRefreshToken), accessTokenExpiresAt, Helper.toLocalDateTime(newRefreshTokenExpiresTime), cookieRefreshToken);

    }

    @Override
    public void deleteSessionById(String sessionId) {

        sessionRepository.deleteSessionBySessionId(sessionId);

    }

    @Override
    public void validateSession(String sessionId, String deviceId, String userAgent, String cookieRefreshToken) {

        long currentTime = Helper.currentTimeInEpochMilli();

        SessionModel sessionModel = sessionRepository.findSessionBySessionId(sessionId);

        if (sessionModel.getSessionIdExpiresAt().isBefore(Helper.toLocalDateTime(currentTime))) {

            validateExpiration(sessionModel.getSessionId(), sessionModel.getRefreshTokenExpiresAt(), currentTime);

            String[] cookieRefreshTokenArray = cookieRefreshToken.split("\\.");

            if (cookieRefreshTokenArray.length != 2) {

                throw new NotFoundException("Session not found");

            }

            validateHashedValue(sessionModel.getSessionId(), sessionModel.getHashedRefreshToken(), cookieRefreshTokenArray[1]);

            long newSessionIdExpiresTime = Helper.expireTimeInEpochMilli(currentTime, activeSessionDuration);

            sessionRepository.updateSessionIdExpiresAtBySessionId(sessionModel.getSessionId(), Helper.toLocalDateTime(newSessionIdExpiresTime));

        }

        validateDeviceId(sessionModel.getSessionId(), sessionModel.getDeviceId(), deviceId);

        validateUserAgent(sessionModel.getSessionId(), sessionModel.getUserAgent(), userAgent);

    }

    @Override
    public ValidateRefreshTokenResponse validateRefreshToken(String deviceId, String userAgent, String cookieRefreshToken) {

        long currentTime = Helper.currentTimeInEpochMilli();

        String[] refreshTokenArray = cookieRefreshToken.split("\\.");

        if (refreshTokenArray.length != 2) {

            throw new UnauthorizedException("Session not found");

        }

        String refreshTokenId = refreshTokenArray[0];
        String rawRefreshToken = refreshTokenArray[1];

        SessionModel sessionModel = sessionRepository.findSessionByRefreshTokenId(refreshTokenId);

        validateExpiration(sessionModel.getSessionId(), sessionModel.getRefreshTokenExpiresAt(), currentTime);

        validateDeviceId(sessionModel.getSessionId(), sessionModel.getDeviceId(), deviceId);

        validateUserAgent(sessionModel.getSessionId(), sessionModel.getUserAgent(), userAgent);

        validateHashedValue(sessionModel.getSessionId(), sessionModel.getHashedRefreshToken(), rawRefreshToken);

        return new ValidateRefreshTokenResponse(sessionModel.getSessionId(), sessionModel.getUserId(), sessionModel.getRole());

    }

    /**
     * HELPERS METHOD
     */

    private void validateDeviceId(String sessionId, String storedDeviceId, String requestedDeviceId) {

        if (!storedDeviceId.equals(requestedDeviceId)) {

            sessionRepository.deleteSessionBySessionId(sessionId);

            throw new UnauthorizedException("Session not found");

        }

    }

    private void validateUserAgent(String sessionId, String storedUserAgent, String requestedUserAgent) {

        if (!storedUserAgent.equals(requestedUserAgent)) {

            sessionRepository.deleteSessionBySessionId(sessionId);

            throw new NotFoundException("Session not found");

        }

    }

    private void validateHashedValue(String sessionId, String hashedText, String rawText) {

        if (!helper.isValidHashedValue(rawText, hashedText)) {

            sessionRepository.deleteSessionBySessionId(sessionId);

            throw new UnauthorizedException("Session not found");

        }

    }

    private void validateExpiration(String sessionId, LocalDateTime expiresAt, long currentTime) {

        if (expiresAt.isBefore(Helper.toLocalDateTime(currentTime))) {

            sessionRepository.deleteSessionBySessionId(sessionId);

            throw new UnauthorizedException("Session not found");

        }

    }

}