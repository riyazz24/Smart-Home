package com.example.smart.home.automation.service;

import com.example.smart.home.automation.model.UserProfileModel;

public interface UserProfileService {

    void createUserProfile(String userId, String fullName, String contactNo);

    void updateUserProfileByUserId(String userId, String email, String contactNo);

    UserProfileModel getUserProfileByUserId(String userId);

}