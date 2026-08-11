package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OtpVerifyResponse {

    private String securityTokenId;

    private String securityToken;

    private LocalDateTime securityTokenExpiresAt;

}