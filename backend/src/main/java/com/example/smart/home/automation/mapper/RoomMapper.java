package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.RoomEntity;
import com.example.smart.home.automation.model.RoomModel;

public class RoomMapper {

    public static RoomModel toModel(RoomEntity entity) {

        if (entity == null) {
            return null;
        }

        return RoomModel.builder()
                .roomId(entity.getRoomId())
                .agentId(entity.getAgentEntity().getAgentId())
                .roomName(entity.getRoomName())
                .build();
    }

    public static RoomEntity toEntity(RoomModel model) {

        if (model == null) {
            return null;
        }

        return RoomEntity.builder()
                .roomId(model.getRoomId())
                .roomName(model.getRoomName())
                .build();

    }

}