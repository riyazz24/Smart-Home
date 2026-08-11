package com.example.smart.home.automation.api.dto.response;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginHttpResponse {

    private Role role;

    private String sessionId;

    private String message;

}