package com.example.smart.home.automation.security.userdetails;

import com.example.smart.home.automation.enums.Role;
import lombok.Getter;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@NullMarked
@SuppressWarnings("ClassCanBeRecord")
public class CustomUserDetails implements UserDetails {

    private final String userId;
    private final Role role;
    private final String email;
    private final String hashedPassword;

    public CustomUserDetails(
            String userId,
            Role role,
            String email,
            String hashedPassword) {
        this.userId = userId;
        this.role = role;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role.getAuthority()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return hashedPassword;
    }

}