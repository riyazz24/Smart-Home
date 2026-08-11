package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Jacksonized
@Builder
public class SecurityTokenModel {

    private String securityTokenId;

    private String email;

    private String securityToken;

    private LocalDateTime securityTokenExpiresAt;

}