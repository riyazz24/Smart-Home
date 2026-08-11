package com.example.smart.home.automation.security.authentication;

import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.security.authentication.dto.response.AuthenticateResponse;
import com.example.smart.home.automation.security.userdetails.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AuthenticateServiceImpl implements AuthenticateService {

    private final AuthenticationManager authenticationManager;

    public AuthenticateServiceImpl(
            AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthenticateResponse authenticate(String email, String rawPassword) {

        try {

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, rawPassword));

            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

            assert customUserDetails != null;

            return new AuthenticateResponse(customUserDetails.getUserId(), customUserDetails.getRole(), customUserDetails.getEmail());

        } catch (BadCredentialsException e) {

            throw new UnauthorizedException("Invalid Username Or Password");

        }

    }

}