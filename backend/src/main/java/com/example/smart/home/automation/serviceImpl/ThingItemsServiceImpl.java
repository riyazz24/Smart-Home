package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.model.ThingItemsModel;
import com.example.smart.home.automation.repository.ThingItemsRepository;
import com.example.smart.home.automation.service.ThingItemsService;
import org.springframework.stereotype.Service;

@Service
public class ThingItemsServiceImpl implements ThingItemsService {

    private final ThingItemsRepository thingItemsRepository;

    public ThingItemsServiceImpl(
            ThingItemsRepository thingItemsRepository) {
        this.thingItemsRepository = thingItemsRepository;
    }

    @Override
    public ThingItemsModel getThingItemsByThingUIDAndChannelId(String thingUID, String channelId) {

        return thingItemsRepository.findByThingUIDAndChannelId(thingUID, channelId);

    }

}
