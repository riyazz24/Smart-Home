package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.CreateSecurityTokenResponse;
import com.example.smart.home.automation.dto.response.GetSecurityTokenByIdResponse;
import com.example.smart.home.automation.exception.BadRequestException;
import com.example.smart.home.automation.model.SecurityTokenModel;
import com.example.smart.home.automation.repository.SecurityTokenRepository;
import com.example.smart.home.automation.service.SecurityTokenService;
import com.example.smart.home.automation.util.Helper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SecurityTokenServiceImpl implements SecurityTokenService {

    private final String invalidOrExpired;
    private final long securityTokenDuration;
    private final SecurityTokenRepository securityTokenRepository;

    public SecurityTokenServiceImpl(
            @Value("${invalid.or.expired.session}") String invalidOrExpired,
            @Value("${security.token.duration}") long securityTokenDuration,
            SecurityTokenRepository securityTokenRepository) {
        this.invalidOrExpired = invalidOrExpired;
        this.securityTokenDuration = securityTokenDuration;
        this.securityTokenRepository = securityTokenRepository;
    }

    @Override
    public CreateSecurityTokenResponse createSecurityToken(String email) {

        long issuedTime = Helper.currentTimeInEpochMilli();
        long expiresTime = Helper.expireTimeInEpochMilli(issuedTime, securityTokenDuration);

        SecurityTokenModel model = SecurityTokenModel.builder()
                .securityTokenId(Helper.getRandomStringOfLength32())
                .email(email)
                .securityToken(Helper.getRandomStringOfLength32())
                .securityTokenExpiresAt(Helper.toLocalDateTime(expiresTime))
                .build();

        securityTokenRepository.save(model);

        return new CreateSecurityTokenResponse(model.getSecurityTokenId(), model.getEmail(), model.getSecurityToken(), model.getSecurityTokenExpiresAt());

    }

    @Override
    public void deleteSecurityTokenById(String securityTokenId) {

        securityTokenRepository.deleteSecurityTokenBySecurityTokenId(securityTokenId);

    }

    @Override
    public GetSecurityTokenByIdResponse getSecurityTokenById(String securityTokenId) {

        SecurityTokenModel model = securityTokenRepository.findSecurityTokenBySecurityTokenId(securityTokenId)
                .orElseThrow(() -> new BadRequestException(invalidOrExpired));

        return new GetSecurityTokenByIdResponse(model.getSecurityTokenId(), model.getEmail(), model.getSecurityToken(), model.getSecurityTokenExpiresAt());

    }

}