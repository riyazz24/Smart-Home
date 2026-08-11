package com.example.smart.home.automation.security.authentication.dto.response;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticateResponse {

    private String userId;

    private Role role;

    private String email;

}