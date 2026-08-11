package com.example.smart.home.automation.configuration;

import com.example.smart.home.automation.service.SessionService;
import com.example.smart.home.automation.security.filter.JwtAuthenticationFilter;
import com.example.smart.home.automation.security.jwt.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtAuthenticationFilterConfig {

    private final String authenticationRequired;
    private final JwtService jwtService;
    private final SessionService sessionService;

    public JwtAuthenticationFilterConfig(
            @Value("${authentication.required}") String authenticationRequired,
            JwtService jwtService,
            SessionService sessionService) {
        this.authenticationRequired = authenticationRequired;
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {

        return new JwtAuthenticationFilter(authenticationRequired, jwtService, sessionService);

    }

}