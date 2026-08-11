package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.SecurityCodeModel;

import java.util.Optional;

public interface SecurityCodeRepository {

    void save(SecurityCodeModel model);

    void deleteSecurityCodeBySecurityCodeId(String securityCodeId);

    Optional<SecurityCodeModel> findSecurityCodeBySecurityCodeId(String securityCodeId);

}