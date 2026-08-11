package com.example.smart.home.automation.service;

import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.model.UserModel;

public interface UserService {

    String createUser(Role role, String email, String hashedPassword);

    void updatePasswordByEmail(String email, String hashedPassword);

    void deleteUserByUserId(String userId);

    UserModel getUserByUserId(String userId);

}