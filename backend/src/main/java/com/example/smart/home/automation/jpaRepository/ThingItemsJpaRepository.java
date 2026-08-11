package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.ThingItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThingItemsJpaRepository extends JpaRepository<ThingItemsEntity, Long> {

    Optional<ThingItemsEntity> findByThingEntity_ThingUIDAndChannelId(String thingUID, String channelId);

}