package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.SessionEntity;
import com.example.smart.home.automation.model.SessionModel;

public class SessionMapper {

    public static SessionModel toModel(SessionEntity entity) {

        if (entity == null) {
            return null;
        }

        return SessionModel.builder()
                .sessionId(entity.getSessionId())
                .userId(entity.getUserEntity().getUserId())
                .role(entity.getRole())
                .deviceId(entity.getDeviceId())
                .userAgent(entity.getUserAgent())
                .refreshTokenId(entity.getRefreshTokenId())
                .hashedRefreshToken(entity.getHashedRefreshToken())
                .accessTokenExpiresAt(entity.getAccessTokenExpiresAt())
                .sessionIdExpiresAt(entity.getSessionIdExpiresAt())
                .refreshTokenExpiresAt(entity.getRefreshTokenExpiresAt())
                .build();

    }

    public static SessionEntity toEntity(SessionModel model) {

        if (model == null) {
            return null;
        }

        return SessionEntity.builder()
                .sessionId(model.getSessionId())
                .role(model.getRole())
                .deviceId(model.getDeviceId())
                .userAgent(model.getUserAgent())
                .refreshTokenId(model.getRefreshTokenId())
                .hashedRefreshToken(model.getHashedRefreshToken())
                .accessTokenExpiresAt(model.getAccessTokenExpiresAt())
                .sessionIdExpiresAt(model.getSessionIdExpiresAt())
                .refreshTokenExpiresAt(model.getRefreshTokenExpiresAt())
                .build();

    }

}