package com.example.smart.home.automation.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {

    USER("USER"),

    ADMIN("ADMIN");

    private final String value;

    public String getAuthority() {
        return "ROLE_" + value;
    }

}