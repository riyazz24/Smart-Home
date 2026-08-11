package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.model.SecurityTokenModel;
import com.example.smart.home.automation.redis.repository.SecurityTokenRedisRepository;
import com.example.smart.home.automation.repository.SecurityTokenRepository;
import com.example.smart.home.automation.util.Helper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class SecurityTokenRepositoryImpl implements SecurityTokenRepository {

    private final SecurityTokenRedisRepository securityTokenRedisRepository;

    public SecurityTokenRepositoryImpl(
            SecurityTokenRedisRepository securityTokenRedisRepository) {
        this.securityTokenRedisRepository = securityTokenRedisRepository;
    }

    @Override
    public void save(SecurityTokenModel model) {

        long ttl = Helper.calculateTtl(model.getSecurityTokenExpiresAt());

        securityTokenRedisRepository.save(model, ttl);

    }

    @Override
    public void deleteSecurityTokenBySecurityTokenId(String securityTokenId) {

        securityTokenRedisRepository.deleteBySecurityTokenId(securityTokenId);

    }

    @Override
    public Optional<SecurityTokenModel> findSecurityTokenBySecurityTokenId(String securityTokenId) {

        return Optional.ofNullable(securityTokenRedisRepository.findBySecurityTokenId(securityTokenId));

    }

}