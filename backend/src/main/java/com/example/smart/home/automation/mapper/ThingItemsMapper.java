package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.ThingItemsEntity;
import com.example.smart.home.automation.model.ThingItemsModel;

public class ThingItemsMapper {

    public static ThingItemsModel toModel(ThingItemsEntity entity) {

        if (entity == null) {
            return null;
        }

        return ThingItemsModel.builder()
                .itemName(entity.getItemName())
                .channelId(entity.getChannelId())
                .channelUID(entity.getChannelUID())
                .itemType(entity.getItemType())
                .build();

    }

    public static ThingItemsEntity toEntity(ThingItemsModel model) {

        if (model == null) {
            return null;
        }

        return ThingItemsEntity.builder()
                .itemName(model.getItemName())
                .channelId(model.getChannelId())
                .channelUID(model.getChannelUID())
                .itemType(model.getItemType())
                .build();

    }

}