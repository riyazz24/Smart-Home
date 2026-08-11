package com.example.smart.home.automation.api.dto.response;

import com.example.smart.home.automation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GetAdminProfileHttpResponse {

    private String adminId;

    private Role role;

    private String email;

    private String fullName;

    private LocalDate dob;

    private String gender;

    private String address;

    private String contactNo;

    private String whatsappNo;

}