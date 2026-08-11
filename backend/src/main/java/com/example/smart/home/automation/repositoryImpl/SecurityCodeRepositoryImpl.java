package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.redis.repository.SecurityCodeRedisRepository;
import com.example.smart.home.automation.util.Helper;
import com.example.smart.home.automation.model.SecurityCodeModel;
import com.example.smart.home.automation.repository.SecurityCodeRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class SecurityCodeRepositoryImpl implements SecurityCodeRepository {

    private final SecurityCodeRedisRepository securityCodeRedisRepository;

    public SecurityCodeRepositoryImpl(
            SecurityCodeRedisRepository securityCodeRedisRepository) {
        this.securityCodeRedisRepository = securityCodeRedisRepository;
    }

    @Override
    public void save(SecurityCodeModel model) {

        long ttl = Helper.calculateTtl(model.getSecurityCodeExpiresAt());

        securityCodeRedisRepository.save(model, ttl);

    }

    @Override
    public void deleteSecurityCodeBySecurityCodeId(String securityCodeId) {

        securityCodeRedisRepository.deleteBySecurityCodeId(securityCodeId);

    }

    @Override
    public Optional<SecurityCodeModel> findSecurityCodeBySecurityCodeId(String securityCodeId) {

        return Optional.ofNullable(securityCodeRedisRepository.findBySecurityCodeId(securityCodeId));

    }

}