package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.CreateSecurityCodeResponse;
import com.example.smart.home.automation.dto.response.GetSecurityCodeByIdResponse;

public interface SecurityCodeService {

    CreateSecurityCodeResponse createSecurityCode(String email);

    void deleteSecurityCodeById(String securityCodeId);

    GetSecurityCodeByIdResponse getSecurityCodeById(String securityCodeId);

}