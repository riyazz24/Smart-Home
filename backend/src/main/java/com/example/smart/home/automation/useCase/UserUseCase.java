package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.CreateUserHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdatePasswordHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateUserProfileHttpRequest;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetUserProfileHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.dto.response.GetSecurityTokenByIdResponse;
import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.exception.ExpiredOrInvalidException;
import com.example.smart.home.automation.model.UserProfileModel;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.SecurityTokenService;
import com.example.smart.home.automation.service.UserProfileService;
import com.example.smart.home.automation.service.UserService;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@Slf4j
public class UserUseCase {

    private final UserService userService;
    private final UserProfileService userProfileService;
    private final SecurityTokenService securityTokenService;
    private final JwtService jwtService;
    private final Helper helper;

    public UserUseCase(
            UserService userService,
            UserProfileService userProfileService,
            SecurityTokenService securityTokenService,
            JwtService jwtService,
            Helper helper) {
        this.userService = userService;
        this.userProfileService = userProfileService;
        this.securityTokenService = securityTokenService;
        this.jwtService = jwtService;
        this.helper = helper;
    }

    @Transactional
    public CreateHttpResponse createUser(CreateUserHttpRequest request) {

        String hashedPassword = helper.toHash(request.getRawPassword());

        String userId = userService.createUser(Role.USER, request.getEmail(), hashedPassword);

        userProfileService.createUserProfile(userId, request.getFullName(), request.getContactNo());

        log.info("\n \n USER CREATED - USER-ID: {} \n", Helper.sanitizeId(userId));

        return new CreateHttpResponse("Registered successfully");

    }

    @Transactional
    public UpdateHttpResponse updateUser(UpdateUserProfileHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String userId = jwtService.extractUserId(accessToken);

        userProfileService.updateUserProfileByUserId(userId, request.getEmail(), request.getContactNo());

        log.info("\n \n USER UPDATED - USER-ID: {} \n", Helper.sanitizeId(userId));

        return new UpdateHttpResponse("Profile updated successfully");

    }

    @Transactional
    public UpdateHttpResponse updatePassword(UpdatePasswordHttpRequest request, String securityTokenId, String securityToken) {

        LocalDateTime issuedAt = Helper.toLocalDateTime(Helper.currentTimeInEpochMilli());

        GetSecurityTokenByIdResponse securityTokenResponse = securityTokenService.getSecurityTokenById(securityTokenId);

        if (securityTokenResponse.getSecurityTokenExpiresAt().isBefore(issuedAt) || !securityTokenResponse.getSecurityToken().equals(securityToken)) {

            throw new ExpiredOrInvalidException("Expired or invalid token");

        }

        userService.updatePasswordByEmail(securityTokenResponse.getEmail(), helper.toHash(request.getRawPassword()));

        securityTokenService.deleteSecurityTokenById(securityTokenResponse.getSecurityTokenId());

        log.debug("\n \n PASSWORD UPDATED - EMAIL: {} \n", Helper.sanitizeEmail(securityTokenResponse.getEmail()));

        return new UpdateHttpResponse("Password updated successfully");

    }

    @Transactional
    public DeleteHttpResponse delete(String userId) {

        userService.deleteUserByUserId(userId);

        log.info("\n \n USER DELETED - USER-ID: {} \n", Helper.sanitizeId(userId));

        return new DeleteHttpResponse("User deleted successfully");

    }

    public GetUserProfileHttpResponse getUser(HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        UserProfileModel userProfileModel = userProfileService.getUserProfileByUserId(jwtService.extractUserId(accessToken));

        return new GetUserProfileHttpResponse(userProfileModel.getUserId(), userProfileModel.getEmail(), userProfileModel.getFullName(), userProfileModel.getContactNo());

    }

    private String getCookieValue(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "ACCESS_TOKEN".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}