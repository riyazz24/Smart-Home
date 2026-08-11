package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.jpaRepository.ThingItemsJpaRepository;
import com.example.smart.home.automation.mapper.ThingItemsMapper;
import com.example.smart.home.automation.model.ThingItemsModel;
import com.example.smart.home.automation.repository.ThingItemsRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ThingItemsRepositoryImpl implements ThingItemsRepository {

    private final ThingItemsJpaRepository thingItemsJpaRepository;

    public ThingItemsRepositoryImpl(
            ThingItemsJpaRepository thingItemsJpaRepository) {
        this.thingItemsJpaRepository = thingItemsJpaRepository;
    }

    @Override
    public ThingItemsModel findByThingUIDAndChannelId(String thingUID, String channelId) {

        return thingItemsJpaRepository.findByThingEntity_ThingUIDAndChannelId(thingUID, channelId)
                .map(ThingItemsMapper::toModel)
                .orElseThrow(()-> new NotFoundException("Thing or channel not found"));

    }

}
