package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.CreateSecurityCodeResponse;
import com.example.smart.home.automation.dto.response.GetSecurityCodeByIdResponse;
import com.example.smart.home.automation.exception.BadRequestException;
import com.example.smart.home.automation.model.SecurityCodeModel;
import com.example.smart.home.automation.repository.SecurityCodeRepository;
import com.example.smart.home.automation.service.SecurityCodeService;
import com.example.smart.home.automation.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SecurityCodeServiceImpl implements SecurityCodeService {

    private final String invalidOrExpired;
    private final long securityCodeDuration;
    private final SecurityCodeRepository securityCodeRepository;

    public SecurityCodeServiceImpl(
            @Value("${invalid.or.expired.session}") String invalidOrExpired,
            @Value("${security.code.duration}") long securityCodeDuration,
            SecurityCodeRepository securityCodeRepository) {
        this.invalidOrExpired = invalidOrExpired;
        this.securityCodeDuration = securityCodeDuration;
        this.securityCodeRepository = securityCodeRepository;
    }

    @Override
    public CreateSecurityCodeResponse createSecurityCode(String email) {

        long issuedTime = Helper.currentTimeInEpochMilli();
        long expiresTime = Helper.expireTimeInEpochMilli(issuedTime, securityCodeDuration);

        SecurityCodeModel model = SecurityCodeModel.builder()
                .securityCodeId(Helper.getRandomStringOfLength32())
                .email(email)
                .securityCode(Helper.getSecurityCode())
                .securityCodeExpiresAt(Helper.toLocalDateTime(expiresTime))
                .build();

        securityCodeRepository.save(model);

        return new CreateSecurityCodeResponse(model.getSecurityCodeId(), model.getEmail(), model.getSecurityCode());

    }

    @Override
    public void deleteSecurityCodeById(String securityCodeId) {

        securityCodeRepository.deleteSecurityCodeBySecurityCodeId(securityCodeId);

    }

    @Override
    public GetSecurityCodeByIdResponse getSecurityCodeById(String securityCodeId) {

        SecurityCodeModel model = securityCodeRepository.findSecurityCodeBySecurityCodeId(securityCodeId)
                .orElseThrow(() -> new BadRequestException(invalidOrExpired));

        return new GetSecurityCodeByIdResponse(model.getSecurityCodeId(), model.getEmail(), model.getSecurityCode(), model.getSecurityCodeExpiresAt());

    }

}