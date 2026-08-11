package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.UserProfileModel;

public interface UserProfileRepository {

    void save(UserProfileModel model);

    void updateUserProfileByUserId(String userId, String email, String contactNo);

    UserProfileModel findByUserId(String userId);

}