package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.UserProfileEntity;
import com.example.smart.home.automation.model.UserProfileModel;

public class UserProfileMapper {

    public static UserProfileModel toModel(UserProfileEntity entity) {

        if (entity == null) {
            return null;
        }

        return UserProfileModel.builder()
                .userId(entity.getUserEntity().getUserId())
                .role(entity.getUserEntity().getRole())
                .email(entity.getUserEntity().getEmail())
                .fullName(entity.getFullName())
                .contactNo(entity.getContactNo())
                .build();

    }

    public static UserProfileEntity toEntity(UserProfileModel model) {

        if (model == null) {
            return null;
        }

        return UserProfileEntity.builder()
                .fullName(model.getFullName())
                .contactNo(model.getContactNo())
                .build();

    }

}