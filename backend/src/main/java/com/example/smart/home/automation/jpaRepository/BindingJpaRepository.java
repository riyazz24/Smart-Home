package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.BindingEntity;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@NullMarked
public interface BindingJpaRepository extends JpaRepository<BindingEntity, Long> {

    void deleteByUid(String uid);

    boolean existsByUid(String uid);

    List<BindingEntity> findAll();

}