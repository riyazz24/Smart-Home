package com.example.smart.home.automation.redis.repository;

import com.example.smart.home.automation.model.SecurityCodeModel;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class SecurityCodeRedisRepository {

    private static final String REDIS_KEY = "SecurityCode:";

    private final RedisTemplate<String, Object> redisTemplate;

    public SecurityCodeRedisRepository(
            RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void save(SecurityCodeModel model, long ttl) {

        redisTemplate.opsForValue().set(REDIS_KEY + model.getSecurityCodeId(), model, ttl, TimeUnit.MILLISECONDS);

    }

    public void deleteBySecurityCodeId(String securityCodeId) {

        redisTemplate.delete(REDIS_KEY + securityCodeId);

    }

    public SecurityCodeModel findBySecurityCodeId(String securityCodeId) {

        Object value = redisTemplate.opsForValue().get(REDIS_KEY + securityCodeId);

        if (value instanceof SecurityCodeModel) {

            return (SecurityCodeModel) value;

        }

        return null;

    }

}