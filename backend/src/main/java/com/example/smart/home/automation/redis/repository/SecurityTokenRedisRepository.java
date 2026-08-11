package com.example.smart.home.automation.redis.repository;

import com.example.smart.home.automation.model.SecurityTokenModel;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class SecurityTokenRedisRepository {

    private static final String REDIS_KEY = "SecurityToken:";

    private final RedisTemplate<String, Object> redisTemplate;

    public SecurityTokenRedisRepository(
            RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void save(SecurityTokenModel model, long ttl) {

        redisTemplate.opsForValue().set(REDIS_KEY + model.getSecurityTokenId(), model, ttl, TimeUnit.MILLISECONDS);

    }

    public void deleteBySecurityTokenId(String securityTokenId) {

        redisTemplate.delete(REDIS_KEY + securityTokenId);

    }

    public SecurityTokenModel findBySecurityTokenId(String securityTokenId) {

        Object value = redisTemplate.opsForValue().get(REDIS_KEY + securityTokenId);

        if (value instanceof SecurityTokenModel) {

            return (SecurityTokenModel) value;

        }

        return null;

    }

}