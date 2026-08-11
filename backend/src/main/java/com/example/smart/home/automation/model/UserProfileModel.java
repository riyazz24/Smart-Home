package com.example.smart.home.automation.model;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class UserProfileModel {

    private String userId;

    private Role role;

    private String email;

    private String fullName;

    private String contactNo;

}