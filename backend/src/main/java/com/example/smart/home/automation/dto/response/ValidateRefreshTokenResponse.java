package com.example.smart.home.automation.dto.response;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ValidateRefreshTokenResponse {

    private String sessionId;

    private String userId;

    private Role role;

}