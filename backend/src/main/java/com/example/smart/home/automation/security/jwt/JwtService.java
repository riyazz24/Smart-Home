package com.example.smart.home.automation.security.jwt;

import com.example.smart.home.automation.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtService {

    /**
     * Constants for claim keys
     */
    public static final String CLAIM_USER_ID = "userId";
    public static final String CLAIM_ROLE = "role";
    private final long accessTokenDuration;
    private final SecretKey secretKey;

    public JwtService(
            @Value("${access.token.duration}") long accessTokenDuration,
            @Value("${jwt.secret}") String secretKeyBase64) {
        this.accessTokenDuration = accessTokenDuration;
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeyBase64));
    }

    /**
     * GENERATE ACCESS TOKEN
     */
    public String create(String userId, Role role, String email) {

        Instant now = Instant.now();

        return Jwts.builder()
                .subject(email)
                .claim(CLAIM_USER_ID, userId)
                .claim(CLAIM_ROLE, role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(accessTokenDuration)))
                .signWith(secretKey)
                .compact();

    }

    /**
     * EXTRACT ALL CLAIMS
     */
    public Claims extractAllClaims(String accessToken) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(accessToken)
                .getPayload();

    }

    /**
     * EXTRACT USER ID
     */
    public String extractUserId(String accessToken) {
        return extractAllClaims(accessToken).get(CLAIM_USER_ID, String.class);
    }

    /**
     * EXTRACT EMAIL
     */
    public String extractEmail(String accessToken) {
        return extractAllClaims(accessToken).getSubject();
    }

    /**
     * EXTRACT ROLE
     */
    public Role extractRole(String accessToken) {
        return Role.valueOf(extractAllClaims(accessToken).get(CLAIM_ROLE, String.class));
    }

    /**
     * EXTRACT ISSUED AT
     */
    public long extractIssuedTime(String accessToken) {
        return extractAllClaims(accessToken).getIssuedAt().toInstant().toEpochMilli();
    }

    /**
     * EXTRACT EXPIRED TIME
     */
    public long extractExpiresTime(String accessToken) {
        return extractAllClaims(accessToken).getExpiration().toInstant().toEpochMilli();
    }

    /**
     * VALIDATE ACCESS TOKEN
     */
    public boolean isValidAccessToken(String accessToken) {

        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(accessToken);
            return true;
        } catch (JwtException | IllegalArgumentException ignored) {
        }
        return false;

    }

}