package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.UserModel;

import java.util.Optional;

public interface UserRepository {

    String save(UserModel model);

    void updatePasswordByEmail(String email, String hashedPassword);

    void deleteByUserId(String userId);

    UserModel findByUserId(String userId);

    UserModel findByEmail(String email);

}