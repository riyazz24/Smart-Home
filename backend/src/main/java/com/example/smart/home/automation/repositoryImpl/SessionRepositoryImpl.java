package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.dto.response.CreateSessionResponse;
import com.example.smart.home.automation.dto.response.UpdateRefreshTokenResponse;
import com.example.smart.home.automation.entity.SessionEntity;
import com.example.smart.home.automation.entity.UserEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.jpaRepository.SessionJpaRepository;
import com.example.smart.home.automation.jpaRepository.UserJpaRepository;
import com.example.smart.home.automation.mapper.SessionMapper;
import com.example.smart.home.automation.model.SessionModel;
import com.example.smart.home.automation.repository.SessionRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;

@Repository
public class SessionRepositoryImpl implements SessionRepository {

    private final UserJpaRepository userJpaRepository;
    private final SessionJpaRepository sessionJpaRepository;

    public SessionRepositoryImpl(
            UserJpaRepository userJpaRepository,
            SessionJpaRepository sessionJpaRepository) {
        this.userJpaRepository = userJpaRepository;
        this.sessionJpaRepository = sessionJpaRepository;
    }

    @Override
    public CreateSessionResponse save(SessionModel model, String cookieRefreshToken) {

        UserEntity userEntity = userJpaRepository.findByUserId(model.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        SessionEntity sessionEntity = SessionMapper.toEntity(model);
        sessionEntity.setUserEntity(userEntity);

        sessionJpaRepository.save(sessionEntity);

        SessionModel sessionModel = SessionMapper.toModel(sessionEntity);

        assert sessionModel != null;

        return new CreateSessionResponse(sessionModel.getSessionId(), cookieRefreshToken, sessionModel.getRefreshTokenExpiresAt());

    }

    @Override
    public void updateSessionIdExpiresAtBySessionId(String sessionId, LocalDateTime sessionIdExpiresAt) {

        int updated = sessionJpaRepository.updateSessionExpiresAtBySessionId(sessionId, sessionIdExpiresAt, Instant.now());

        if (updated == 0) {
            throw new NotFoundException("Session not found");
        }

    }

    @Override
    public UpdateRefreshTokenResponse updateRefreshTokeBySessionId(String sessionId, String refreshTokenId, String hashedRefreshToken, LocalDateTime accessTokenExpiresAt, LocalDateTime refreshTokenExpiresAt, String cookieRefreshToken) {

        int updated = sessionJpaRepository.updateRefreshTokenBySessionId(sessionId, refreshTokenId, hashedRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt, Instant.now());

        if (updated == 0) {
            throw new NotFoundException("Session not found");
        }

        return new UpdateRefreshTokenResponse(cookieRefreshToken, refreshTokenExpiresAt);

    }

    @Override
    public void deleteSessionBySessionId(String sessionId) {

        int deleted = sessionJpaRepository.deleteBySessionId(sessionId);

        if (deleted == 0) {
            throw new NotFoundException("Session not found");
        }

    }

    @Override
    public SessionModel findSessionBySessionId(String sessionId) {

        return sessionJpaRepository.findBySessionId(sessionId)
                .map(SessionMapper::toModel)
                .orElseThrow(() -> new NotFoundException("Session not found"));

    }

    @Override
    public SessionModel findSessionByRefreshTokenId(String refreshTokenId) {

        return sessionJpaRepository.findByRefreshTokenId(refreshTokenId)
                .map(SessionMapper::toModel)
                .orElseThrow(() -> new UnauthorizedException("Session not found"));

    }

}