package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.ThingItemsModel;

public interface ThingItemsRepository {

    ThingItemsModel findByThingUIDAndChannelId(String thingUID, String channelId);

}