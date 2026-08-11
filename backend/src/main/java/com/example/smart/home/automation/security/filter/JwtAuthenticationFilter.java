package com.example.smart.home.automation.security.filter;

import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.security.userdetails.CustomUserDetails;
import com.example.smart.home.automation.service.SessionService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@NullMarked
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final List<String> PUBLIC_URL = List.of(
            "/user/create",
            "/auth/login",
            "/auth/rotate/refresh/token",
            "/auth/otp/trigger",
            "/auth/otp/retrigger",
            "/auth/otp/verify",
            "/user/update/password",
            "/agent/create",
            "/agent/linked/status",
            "/ws"
    );

    private final String authenticationRequired;
    private final JwtService jwtService;
    private final SessionService sessionService;

    public JwtAuthenticationFilter(
            String authenticationRequired,
            JwtService jwtService,
            SessionService sessionService) {
        this.authenticationRequired = authenticationRequired;
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return PUBLIC_URL.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws IOException {

        try {

            String accessToken = getCookieValue(httpServletRequest, "ACCESS_TOKEN");

            if (accessToken == null || accessToken.isBlank()) {
                unauthorized(httpServletResponse, authenticationRequired);
                return;
            }

            if (!jwtService.isValidAccessToken(accessToken)) {
                unauthorized(httpServletResponse, authenticationRequired);
                return;
            }

            String deviceId = httpServletRequest.getHeader("X-DeviceId");
            String userAgent = httpServletRequest.getHeader("User-Agent");
            String userId = jwtService.extractUserId(accessToken);
            Role role = jwtService.extractRole(accessToken);
            String email = jwtService.extractEmail(accessToken);

            String sessionId = httpServletRequest.getHeader("X-SessionId");
            String rawRefreshToken = getCookieValue(httpServletRequest, "REFRESH_TOKEN");

            sessionService.validateSession(sessionId, deviceId, userAgent, rawRefreshToken);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                Role roleEnum = null;

                if (role != null) {
                    roleEnum = role;
                }

                assert roleEnum != null;

                CustomUserDetails customUserDetails = new CustomUserDetails(
                        userId,
                        roleEnum,
                        email,
                        ""
                );

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = getUsernamePasswordAuthenticationToken(customUserDetails, httpServletRequest);

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            }

            filterChain.doFilter(httpServletRequest, httpServletResponse);

        } catch (Exception e) {

            unauthorized(httpServletResponse, "Authentication Error!");

        }

    }

    /**
     * HELPER METHODS
     */
    @NotNull
    private UsernamePasswordAuthenticationToken getUsernamePasswordAuthenticationToken(CustomUserDetails customUserDetails, HttpServletRequest httpServletRequest) {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                customUserDetails,
                null,
                customUserDetails.getAuthorities()
        );

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));

        return usernamePasswordAuthenticationToken;

    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(message);
    }

    @Nullable
    private String getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}