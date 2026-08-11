package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.enums.Role;
import com.example.smart.home.automation.model.UserModel;
import com.example.smart.home.automation.repository.UserRepository;
import com.example.smart.home.automation.service.UserService;
import com.example.smart.home.automation.util.Helper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(
            UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String createUser(Role role, String email, String hashedPassword) {

        UserModel model = UserModel.builder()
                .userId(Helper.getRandomStringOfLength16())
                .role(role)
                .email(email)
                .hashedPassword(hashedPassword)
                .build();

        return userRepository.save(model);

    }

    @Override
    public void updatePasswordByEmail(String email, String hashedPassword) {

        userRepository.updatePasswordByEmail(email, hashedPassword);

    }

    @Override
    public void deleteUserByUserId(String userId) {

        userRepository.deleteByUserId(userId);

    }

    @Override
    public UserModel getUserByUserId(String userId) {

        return userRepository.findByUserId(userId);

    }

}