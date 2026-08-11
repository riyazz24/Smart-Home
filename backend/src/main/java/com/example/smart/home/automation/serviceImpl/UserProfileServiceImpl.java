package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.model.UserProfileModel;
import com.example.smart.home.automation.repository.UserProfileRepository;
import com.example.smart.home.automation.service.UserProfileService;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(
            UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public void createUserProfile(String userId, String fullName, String contactNo) {

        UserProfileModel model = UserProfileModel.builder()
                .userId(userId)
                .fullName(fullName)
                .contactNo(contactNo)
                .build();

        userProfileRepository.save(model);

    }

    @Override
    public void updateUserProfileByUserId(String userId, String email, String contactNo) {

        userProfileRepository.updateUserProfileByUserId(userId, email, contactNo);

    }

    @Override
    public UserProfileModel getUserProfileByUserId(String userId) {

        return userProfileRepository.findByUserId(userId);

    }

}
