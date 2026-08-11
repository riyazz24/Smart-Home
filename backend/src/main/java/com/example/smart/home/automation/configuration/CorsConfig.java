package com.example.smart.home.automation.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    private final String allowedOrigin;

    public CorsConfig(
            @Value("${allowed.origin}") String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration corsConfigurationObj = new CorsConfiguration();

        corsConfigurationObj.setAllowedOriginPatterns(List.of(allowedOrigin));

        corsConfigurationObj.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE"));

        corsConfigurationObj.setAllowedHeaders(List.of("*"));

        corsConfigurationObj.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();

        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfigurationObj);

        return urlBasedCorsConfigurationSource;

    }

}