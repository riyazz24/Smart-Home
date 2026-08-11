package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateSecurityCodeResponse {

    private String securityCodeId;

    private String email;

    private String securityCode;

}