package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.LoginHttpRequest;
import com.example.smart.home.automation.api.dto.request.OtpTriggerHttpRequest;
import com.example.smart.home.automation.api.dto.request.OtpVerifyHttpRequest;
import com.example.smart.home.automation.api.dto.response.OtpReTriggerHttpResponse;
import com.example.smart.home.automation.api.dto.response.OtpTriggerHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.dto.response.*;
import com.example.smart.home.automation.exception.ExpiredOrInvalidException;
import com.example.smart.home.automation.model.UserModel;
import com.example.smart.home.automation.security.authentication.AuthenticateService;
import com.example.smart.home.automation.security.authentication.dto.response.AuthenticateResponse;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.*;
import com.example.smart.home.automation.template.EmailTemplate;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@Slf4j
public class AuthUseCase {

    private final AuthenticateService authenticateService;
    private final UserService userService;
    private final SessionService sessionService;
    private final SecurityCodeService securityCodeService;
    private final SecurityTokenService securityTokenService;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthUseCase(
            AuthenticateService authenticateService,
            UserService userService,
            SessionService sessionService,
            SecurityCodeService securityCodeService,
            SecurityTokenService securityTokenService,
            JwtService jwtService,
            EmailService emailService) {
        this.authenticateService = authenticateService;
        this.userService = userService;
        this.sessionService = sessionService;
        this.securityCodeService = securityCodeService;
        this.securityTokenService = securityTokenService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public LoginResponse login(LoginHttpRequest request, String deviceId, String userAgent) {

        AuthenticateResponse authenticateResponse = authenticateService.authenticate(request.getEmail(), request.getRawPassword());

        log.info("\n \n AUTHENTICATION SUCCESSFUL - USER-ID: {} \n", Helper.sanitizeId(authenticateResponse.getUserId()));

        String accessToken = jwtService.create(authenticateResponse.getUserId(), authenticateResponse.getRole(), authenticateResponse.getEmail());

        CreateSessionResponse createSessionResponse = sessionService.createSession(authenticateResponse.getUserId(), authenticateResponse.getRole(), deviceId, userAgent, Helper.toLocalDateTime(jwtService.extractIssuedTime(accessToken)), Helper.toLocalDateTime(jwtService.extractExpiresTime(accessToken)));

        return new LoginResponse(authenticateResponse.getRole(), accessToken, createSessionResponse.getSessionId(), createSessionResponse.getCookieRefreshToken(), Helper.toLocalDateTime(jwtService.extractExpiresTime(accessToken)), createSessionResponse.getRefreshTokenExpiresAt(), "You are logged in successfully");

    }

    @Transactional
    public RotateRefreshTokenResponse rotateRefreshToken(String deviceId, String userAgent, String cookieRefreshToken) {

        ValidateRefreshTokenResponse validateRefreshTokenResponse = sessionService.validateRefreshToken(deviceId, userAgent, cookieRefreshToken);

        UserModel userModel = userService.getUserByUserId(validateRefreshTokenResponse.getUserId());

        String accessToken = jwtService.create(validateRefreshTokenResponse.getUserId(), validateRefreshTokenResponse.getRole(), userModel.getEmail());

        UpdateRefreshTokenResponse updateRefreshTokenResponse = sessionService.UpdateRefreshTokenBySessionId(validateRefreshTokenResponse.getSessionId(), Helper.toLocalDateTime(jwtService.extractExpiresTime(accessToken)));

        log.debug("\n \n REFRESH TOKEN ROTATED - USER-ID: {} \n", Helper.sanitizeId(validateRefreshTokenResponse.getUserId()));

        return new RotateRefreshTokenResponse(accessToken, updateRefreshTokenResponse.getCookieRefreshToken(), Helper.toLocalDateTime(jwtService.extractExpiresTime(accessToken)), updateRefreshTokenResponse.getRefreshTokenExpiresAt());

    }


    @Transactional
    public UpdateHttpResponse logout(String sessionId, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        sessionService.deleteSessionById(sessionId);

        log.info("\n \n LOGOUT SUCCESSFUL - USER-ID: {}, SESSION-ID: {} \n", Helper.sanitizeId(jwtService.extractUserId(accessToken)), Helper.sanitizeId(sessionId));

        return new UpdateHttpResponse("You are logged out successfully");

    }

    public OtpTriggerHttpResponse optTrigger(OtpTriggerHttpRequest request) {

        CreateSecurityCodeResponse createSecurityCodeResponse = securityCodeService.createSecurityCode(request.getEmail());

        String otpEmailTemplate = EmailTemplate.otp(createSecurityCodeResponse.getSecurityCode());

        emailService.send(createSecurityCodeResponse.getEmail(), "OTP Verification", otpEmailTemplate);

        log.debug("\n \n OTP TRIGGERED - SECURITY-CODE-ID: {} \n", Helper.sanitizeId(createSecurityCodeResponse.getSecurityCodeId()));

        return new OtpTriggerHttpResponse(createSecurityCodeResponse.getSecurityCodeId());

    }

    public OtpReTriggerHttpResponse otpReTrigger(String securityCodeId) {

        GetSecurityCodeByIdResponse getSecurityCodeByIdResponse = securityCodeService.getSecurityCodeById(securityCodeId);

        CreateSecurityCodeResponse createSecurityCodeResponse = securityCodeService.createSecurityCode(getSecurityCodeByIdResponse.getEmail());

        String otpEmailTemplate = EmailTemplate.otp(createSecurityCodeResponse.getSecurityCode());

        emailService.send(createSecurityCodeResponse.getEmail(), "OTP Verification", otpEmailTemplate);

        log.debug("\n \n OTP RE-TRIGGERED - SECURITY-CODE-ID: {} \n", Helper.sanitizeId(createSecurityCodeResponse.getSecurityCodeId()));

        return new OtpReTriggerHttpResponse(createSecurityCodeResponse.getSecurityCodeId());

    }

    public OtpVerifyResponse otpVerify(OtpVerifyHttpRequest request, String securityCodeId) {

        LocalDateTime issuedAt = Helper.toLocalDateTime(Helper.currentTimeInEpochMilli());

        GetSecurityCodeByIdResponse getSecurityCodeByIdResponse = securityCodeService.getSecurityCodeById(securityCodeId);

        if (getSecurityCodeByIdResponse.getSecurityCodeExpiresAt().isBefore(issuedAt) || !getSecurityCodeByIdResponse.getSecurityCode().equals(request.getSecurityCode())) {

            throw new ExpiredOrInvalidException("Expired or invalid OTP code");

        }

        CreateSecurityTokenResponse createSecurityTokenResponse = securityTokenService.createSecurityToken(getSecurityCodeByIdResponse.getEmail());

        securityCodeService.deleteSecurityCodeById(getSecurityCodeByIdResponse.getSecurityCodeId());

        log.debug("\n \n OTP VERIFIED - SECURITY-CODE-ID: {} \n", Helper.sanitizeId(securityCodeId));

        return new OtpVerifyResponse(createSecurityTokenResponse.getSecurityTokenId(), createSecurityTokenResponse.getSecurityToken(), createSecurityTokenResponse.getSecurityTokenExpiresAt());

    }

    private String getCookieValue(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "ACCESS_TOKEN".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}