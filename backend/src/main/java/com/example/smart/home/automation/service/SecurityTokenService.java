package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.CreateSecurityTokenResponse;
import com.example.smart.home.automation.dto.response.GetSecurityTokenByIdResponse;

public interface SecurityTokenService {

    CreateSecurityTokenResponse createSecurityToken(String email);

    void deleteSecurityTokenById(String securityTokenId);

    GetSecurityTokenByIdResponse getSecurityTokenById(String securityTokenId);

}