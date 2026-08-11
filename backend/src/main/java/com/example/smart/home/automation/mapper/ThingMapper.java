package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.ThingEntity;
import com.example.smart.home.automation.model.ThingModel;

public class ThingMapper {

    public static ThingModel toModel(ThingEntity entity) {

        if (entity == null) {
            return null;
        }

        return ThingModel.builder()
                .roomId(entity.getRoomEntity().getRoomId())
                .thingUid(entity.getThingUID())
                .thingTypeUid(entity.getThingTypeUID())
                .label(entity.getLabel())
                .macAddress(entity.getMacAddress())
                .ipAddress(entity.getIpAddress())
                .build();

    }

    public static ThingEntity toEntity(ThingModel model) {

        if (model == null) {
            return null;
        }

        return ThingEntity.builder()
                .thingUID(model.getThingUid())
                .thingTypeUID(model.getThingTypeUid())
                .label(model.getLabel())
                .macAddress(model.getMacAddress())
                .ipAddress(model.getIpAddress())
                .build();

    }

}
