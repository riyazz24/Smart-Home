package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.entity.UserEntity;
import com.example.smart.home.automation.entity.UserProfileEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.jpaRepository.UserJpaRepository;
import com.example.smart.home.automation.jpaRepository.UserProfileJpaRepository;
import com.example.smart.home.automation.mapper.UserProfileMapper;
import com.example.smart.home.automation.model.UserProfileModel;
import com.example.smart.home.automation.repository.UserProfileRepository;
import org.springframework.stereotype.Repository;

@Repository
public class UserProfileRepositoryImpl implements UserProfileRepository {

    private final UserJpaRepository userJpaRepository;
    private final UserProfileJpaRepository userProfileJpaRepository;

    public UserProfileRepositoryImpl(
            UserJpaRepository userJpaRepository,
            UserProfileJpaRepository userProfileJpaRepository) {
        this.userJpaRepository = userJpaRepository;
        this.userProfileJpaRepository = userProfileJpaRepository;
    }

    @Override
    public void save(UserProfileModel model) {

        UserEntity userEntity = userJpaRepository.findByUserId(model.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        UserProfileEntity userProfileEntity = UserProfileMapper.toEntity(model);
        userProfileEntity.setUserEntity(userEntity);

        userProfileJpaRepository.save(userProfileEntity);

    }

    @Override
    public void updateUserProfileByUserId(String userId, String email, String contactNo) {

        UserProfileEntity userProfileEntity = userProfileJpaRepository.findByUserEntity_UserId(userId)
                .orElseThrow(() -> new NotFoundException("User profile not found"));

        UserEntity userEntity = userProfileEntity.getUserEntity();
        userEntity.setEmail(email);

        userProfileEntity.setContactNo(contactNo);

        userProfileJpaRepository.save(userProfileEntity);

    }

    @Override
    public UserProfileModel findByUserId(String UserId) {

        return userProfileJpaRepository.findByUserEntity_UserId(UserId)
                .map(UserProfileMapper::toModel)
                .orElseThrow(() -> new NotFoundException("User profile not found"));

    }

}