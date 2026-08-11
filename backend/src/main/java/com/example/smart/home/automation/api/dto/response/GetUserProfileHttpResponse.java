package com.example.smart.home.automation.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetUserProfileHttpResponse {

    private String userId;

    private String email;

    private String fullName;

    private String contactNo;

}