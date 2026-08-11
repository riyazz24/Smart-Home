package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.LoginHttpRequest;
import com.example.smart.home.automation.api.dto.request.OtpTriggerHttpRequest;
import com.example.smart.home.automation.api.dto.request.OtpVerifyHttpRequest;
import com.example.smart.home.automation.api.dto.response.LoginHttpResponse;
import com.example.smart.home.automation.api.dto.response.OtpReTriggerHttpResponse;
import com.example.smart.home.automation.api.dto.response.OtpTriggerHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.dto.response.LoginResponse;
import com.example.smart.home.automation.dto.response.OtpVerifyResponse;
import com.example.smart.home.automation.dto.response.RotateRefreshTokenResponse;
import com.example.smart.home.automation.useCase.AuthUseCase;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthUseCase authUseCase;

    public AuthController(
            AuthUseCase authUseCase) {
        this.authUseCase = authUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginHttpResponse> login(@Valid @RequestBody LoginHttpRequest request, @RequestHeader(value = "X-DeviceId") String deviceId, HttpServletRequest httpServletRequest) {

        LoginResponse loginResponse = authUseCase.login(request, deviceId, httpServletRequest.getHeader("User-Agent"));

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok();

        addCookieIfPresent(
                responseBuilder,
                "ACCESS_TOKEN",
                loginResponse.getAccessToken(),
                (Helper.toEpochMillis(loginResponse.getAccessTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000
        );

        addCookieIfPresent(
                responseBuilder,
                "REFRESH_TOKEN",
                loginResponse.getCookieRefreshToken(),
                (Helper.toEpochMillis(loginResponse.getRefreshTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000
        );

        return responseBuilder.body(new LoginHttpResponse(loginResponse.getRole(), loginResponse.getSessionId(), loginResponse.getMessage()));

    }

    @PostMapping("/rotate/refresh/token")
    public ResponseEntity<Void> rotateRefreshToken(@RequestHeader(value = "X-DeviceId") String deviceId, @CookieValue(value = "REFRESH_TOKEN") String refreshToken, HttpServletRequest httpServletRequest) {

        RotateRefreshTokenResponse rotateRefreshTokenResponse = authUseCase.rotateRefreshToken(deviceId, httpServletRequest.getHeader("User-Agent"), refreshToken);

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok();

        if (rotateRefreshTokenResponse.getAccessToken() != null && !rotateRefreshTokenResponse.getAccessToken().isBlank()) {

            ResponseCookie cookieAccessToken = Helper.createCookie("ACCESS_TOKEN", rotateRefreshTokenResponse.getAccessToken(), (Helper.toEpochMillis(rotateRefreshTokenResponse.getAccessTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000);

            responseBuilder.header(HttpHeaders.SET_COOKIE, cookieAccessToken.toString());

        }

        if (rotateRefreshTokenResponse.getCookieRefreshToken() != null && !rotateRefreshTokenResponse.getCookieRefreshToken().isBlank()) {

            ResponseCookie cookieRefreshToken = Helper.createCookie("REFRESH_TOKEN", rotateRefreshTokenResponse.getCookieRefreshToken(), (Helper.toEpochMillis(rotateRefreshTokenResponse.getRefreshTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000);

            responseBuilder.header(HttpHeaders.SET_COOKIE, cookieRefreshToken.toString());

        }

        return responseBuilder.build();

    }

    @PostMapping("/logout")
    public ResponseEntity<UpdateHttpResponse> logout(@RequestHeader("X-SessionId") String sessionId, HttpServletRequest httpServletRequest) {

        ResponseCookie accessTokenCookie = Helper.clearCookie("ACCESS_TOKEN");
        ResponseCookie refreshTokenCookie = Helper.clearCookie("REFRESH_TOKEN");

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(authUseCase.logout(sessionId, httpServletRequest));

    }

    @PostMapping("/otp/trigger")
    public ResponseEntity<OtpTriggerHttpResponse> otpTrigger(@Valid @RequestBody OtpTriggerHttpRequest request) {

        return ResponseEntity.ok(authUseCase.optTrigger(request));

    }

    @PostMapping("/otp/retrigger")
    public ResponseEntity<OtpReTriggerHttpResponse> otpReTrigger(@RequestHeader(value = "X-SecurityCodeId") String securityCodeId) {

        return ResponseEntity.ok(authUseCase.otpReTrigger(securityCodeId));

    }

    @PostMapping("/otp/verify")
    public ResponseEntity<Void> otpVerify(@Valid @RequestBody OtpVerifyHttpRequest request, @RequestHeader(value = "X-SecurityCodeId") String securityCodeId) {

        OtpVerifyResponse otpVerifyResponse = authUseCase.otpVerify(request, securityCodeId);

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok();

        if (otpVerifyResponse.getSecurityToken() != null && !otpVerifyResponse.getSecurityToken().isBlank()) {

            ResponseCookie cookieSecurityTokenId = Helper.createCookie("SECURITY_TOKEN_ID", otpVerifyResponse.getSecurityTokenId(), (Helper.toEpochMillis(otpVerifyResponse.getSecurityTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000);
            ResponseCookie cookieSecurityToken = Helper.createCookie("SECURITY_TOKEN", otpVerifyResponse.getSecurityToken(), (Helper.toEpochMillis(otpVerifyResponse.getSecurityTokenExpiresAt()) - Helper.currentTimeInEpochMilli()) / 1000);

            responseBuilder.header(HttpHeaders.SET_COOKIE, cookieSecurityTokenId.toString());
            responseBuilder.header(HttpHeaders.SET_COOKIE, cookieSecurityToken.toString());

        }

        return responseBuilder.build();

    }

    /**
     * HELPER METHODS
     */
    private void addCookieIfPresent(ResponseEntity.BodyBuilder responseBuilder, String name, String value, long duration) {
        if (value != null && !value.isBlank()) {
            ResponseCookie cookie = Helper.createCookie(name, value, duration);
            responseBuilder.header(HttpHeaders.SET_COOKIE, cookie.toString());
        }
    }

}