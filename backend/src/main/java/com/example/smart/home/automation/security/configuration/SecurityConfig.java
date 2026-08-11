package com.example.smart.home.automation.security.configuration;

import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.security.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] PUBLIC_URL = {
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
    };

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity

                // Exception handling
//                .exceptionHandling(exception -> exception
//                        .accessDeniedHandler(new CustomAccessDeniedHandler()))

                // Disable csrf
                .csrf(AbstractHttpConfigurer::disable)

                // CORS - uses corsConfigurationSource() bean defined below
                .cors(Customizer.withDefaults())

                // Explicitly disable form-login and http-basic (we rely on JWT)
                .httpBasic(AbstractHttpConfigurer::disable).formLogin(AbstractHttpConfigurer::disable)

                // Authorize requests
                .authorizeHttpRequests(auth -> auth

                        // public endpoints
                        .requestMatchers(PUBLIC_URL).permitAll()

                        // protected endpoints
                        .requestMatchers("/user/**").hasAnyRole(Role.USER.getValue())

                        // any other request must be authenticated
                        .anyRequest().authenticated())

                // Stateless session management for JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Add JWT filter before username password authentication filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

}