package com.example.smart.home.automation.security.userdetails;

import com.example.smart.home.automation.model.UserModel;
import com.example.smart.home.automation.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@NullMarked
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(
            UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserModel userModel = userRepository.findByEmail(email);

        return new CustomUserDetails(userModel.getUserId(), userModel.getRole(), userModel.getEmail(), userModel.getHashedPassword());

    }

}