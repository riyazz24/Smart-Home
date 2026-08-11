package com.example.smart.home.automation.service;

import com.example.smart.home.automation.model.ThingItemsModel;

public interface ThingItemsService {

    ThingItemsModel getThingItemsByThingUIDAndChannelId(String thingUID, String channelId);

}