package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.jpaRepository.UserJpaRepository;
import com.example.smart.home.automation.mapper.UserMapper;
import com.example.smart.home.automation.model.UserModel;
import com.example.smart.home.automation.repository.UserRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository userJpaRepository;

    public UserRepositoryImpl(
            UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    public String save(UserModel model) {

        userJpaRepository.save(UserMapper.toEntity(model));

        return model.getUserId();

    }

    @Override
    public void updatePasswordByEmail(String email, String hashedPassword) {

        int updated = userJpaRepository.updatePasswordByEmail(email, hashedPassword, Instant.now());

        if (updated == 0) {
            throw new NotFoundException("User not found");
        }

    }

    @Override
    public void deleteByUserId(String userId) {

        int deleted = userJpaRepository.deleteByUserId(userId);

        if (deleted == 0) {
            throw new NotFoundException("User not found");
        }

    }

    @Override
    public UserModel findByUserId(String userId) {

        return userJpaRepository.findByUserId(userId)
                .map(UserMapper::toModel)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

    }

    @Override
    public UserModel findByEmail(String email) {

        return userJpaRepository.findByEmail(email)
                .map(UserMapper::toModel)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

    }

}