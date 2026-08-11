package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.UserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileJpaRepository extends JpaRepository<UserProfileEntity, Long> {

    Optional<UserProfileEntity> findByUserEntity_UserId(String userId);

}