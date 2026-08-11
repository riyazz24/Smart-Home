package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.SecurityTokenModel;

import java.util.Optional;

public interface SecurityTokenRepository {

    void save(SecurityTokenModel model);

    void deleteSecurityTokenBySecurityTokenId(String securityTokenId);

    Optional<SecurityTokenModel> findSecurityTokenBySecurityTokenId(String securityTokenId);

}