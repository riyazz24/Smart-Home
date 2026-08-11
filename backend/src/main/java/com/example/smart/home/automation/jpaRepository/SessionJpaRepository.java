package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

public interface SessionJpaRepository extends JpaRepository<SessionEntity, Long> {

    @Modifying(flushAutomatically = true)
    @Query("""
            UPDATE SessionEntity ref
            SET ref.refreshTokenId = :refreshTokenId,
                ref.hashedRefreshToken = :hashedRefreshToken,
                ref.accessTokenExpiresAt = :accessTokenExpiresAt,
                ref.refreshTokenExpiresAt = :refreshTokenExpiresAt,
                ref.updatedAt = :updatedAt
            WHERE ref.sessionId = :sessionId
            """)
    int updateRefreshTokenBySessionId(@Param("sessionId") String sessionId,
                                      @Param("refreshTokenId") String refreshTokenId,
                                      @Param("hashedRefreshToken") String hashedRefreshToken,
                                      @Param("accessTokenExpiresAt") LocalDateTime accessTokenExpiresAt,
                                      @Param("refreshTokenExpiresAt") LocalDateTime refreshTokenExpiresAt,
                                      @Param("updatedAt") Instant updatedAt);

    @Modifying(flushAutomatically = true)
    @Query("""
            UPDATE SessionEntity ref
            SET ref.sessionIdExpiresAt = :sessionIdExpiresAt,
                ref.updatedAt = :updatedAt
            WHERE ref.sessionId = :sessionId
            """)
    int updateSessionExpiresAtBySessionId(@Param("sessionId") String sessionId,
                                          @Param("sessionIdExpiresAt") LocalDateTime sessionIdExpiresAt,
                                          @Param("updatedAt") Instant updatedAt);

    int deleteBySessionId(String sessionId);

    Optional<SessionEntity> findBySessionId(String sessionId);

    Optional<SessionEntity> findByRefreshTokenId(String refreshTokenId);


}