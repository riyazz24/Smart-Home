package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {

    @Modifying(flushAutomatically = true)
    @Query("""
            UPDATE UserEntity ref
            SET ref.hashedPassword = :hashedPassword,
            ref.updatedAt = :updatedAt
            WHERE ref.email = :email
            """)
    int updatePasswordByEmail(
            @Param("email") String email,
            @Param("hashedPassword") String hashedPassword,
            @Param("updatedAt") Instant updatedAt
    );

    int deleteByUserId(String userId);

    Optional<UserEntity> findByUserId(String userId);

    Optional<UserEntity> findByEmail(String email);

}