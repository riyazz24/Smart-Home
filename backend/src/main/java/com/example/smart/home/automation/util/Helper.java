package com.example.smart.home.automation.util;

import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.UUID;

@Component
public class Helper {

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();
    private final PasswordEncoder passwordEncoder;

    public Helper(
            PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * HASH RELATED HELPERS
     */
    public String toHash(String plainText) {
        return passwordEncoder.encode(plainText);
    }

    public boolean isValidHashedValue(String plainText, String hashedText) {
        return passwordEncoder.matches(plainText, hashedText);
    }

    /**
     * GENERATOR RELATED HELPERS
     */
    private static String generateRandomString(int length) {
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public static String getRandomStringOfLength32() {
        return generateRandomString(32);
    }

    public static String getRandomStringOfLength16() {
        return generateRandomString(16);
    }

    public static String[] getRefreshTokenArray() {

        String tokenId = UUID.randomUUID().toString().replace("-", "");

        String secret = getRandomStringOfLength32();

        String cookieRefreshToken = tokenId + "." + secret;

        return new String[]{tokenId, secret, cookieRefreshToken};
    }

    public static String getSecurityCode() {
        return String.format("%06d", secureRandom.nextInt(999_999));
    }

    /**
     * TIME RELATED HELPERS
     */
    public static long currentTimeInEpochMilli() {
        return Instant.now().toEpochMilli();
    }

    public static long expireTimeInEpochMilli(long issuedTimeMilliSeconds, long durationInMilliSeconds) {
        return issuedTimeMilliSeconds + durationInMilliSeconds;
    }

    public static long toEpochMillis(LocalDateTime localDateTime) {

        if (localDateTime == null) {
            return 0L;
        }

        return localDateTime
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli();
    }

    public static LocalDateTime toLocalDateTime(long epochMilli) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMilli), ZoneId.systemDefault());
    }

    public static long calculateTtl(LocalDateTime expiresAt) {
        long expiresTime = expiresAt
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli();

        long ttl = expiresTime - Helper.currentTimeInEpochMilli();
        return Math.max(ttl, 0);
    }

    /**
     * SANITIZED RELATED HELPERS
     */
    public static String sanitizeId(String id) {

        if (id == null) return null;

        if (id.length() <= 4) return id;

        return id.substring(0, 2) + "****" + id.substring(id.length() - 2);

    }

    public static String sanitizeEmail(String email) {

        if (email == null || !email.contains("@")) return email;

        String[] parts = email.split("@");
        String name = parts[0];
        String domain = parts[1];

        if (name.length() <= 2) {
            return name.charAt(0) + "*@" + domain;
        }

        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + "@" + domain;

    }

    /**
     * RESPONSE RELATED HELPERS
     */
    public static ResponseCookie createCookie(String name, String value, long duration) {
        return ResponseCookie.from(name, value).httpOnly(true).secure(false).path("/").maxAge(duration).sameSite("Lax").build();
    }

    public static ResponseCookie clearCookie(String name) {
        return ResponseCookie.from(name, "").httpOnly(true).secure(false).path("/").maxAge(0).sameSite("Lax").build();
    }

}