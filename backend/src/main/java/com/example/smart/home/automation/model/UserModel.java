package com.example.smart.home.automation.model;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserModel {

    private String userId;

    private Role role;

    private String email;

    private String hashedPassword;

}