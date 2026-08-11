package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.UserEntity;
import com.example.smart.home.automation.model.UserModel;

public class UserMapper {

    public static UserModel toModel(UserEntity entity) {

        if (entity == null) {
            return null;
        }

        return UserModel.builder()
                .userId(entity.getUserId())
                .role(entity.getRole())
                .email(entity.getEmail())
                .hashedPassword(entity.getHashedPassword())
                .build();
    }

    public static UserEntity toEntity(UserModel model) {

        if (model == null) {
            return null;
        }

        return UserEntity.builder()
                .userId(model.getUserId())
                .role(model.getRole())
                .email(model.getEmail())
                .hashedPassword(model.getHashedPassword())
                .build();

    }

}