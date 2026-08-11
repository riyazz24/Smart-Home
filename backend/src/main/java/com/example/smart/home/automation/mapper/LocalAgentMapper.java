package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.AgentEntity;
import com.example.smart.home.automation.model.AgentModel;

public class LocalAgentMapper {

    public static AgentModel toModel(AgentEntity entity) {

        if (entity == null) {
            return null;
        }

        return AgentModel.builder()
                .agentId(entity.getAgentId())
                .userId(entity.getUserEntity().getUserId())
                .localAgentId(entity.getLocalAgentId())
                .agentName(entity.getAgentName())
                .pairingCode(entity.getPairingCode())
                .connectionStatus(entity.getConnectionStatus())
                .build();

    }

    public static AgentEntity toEntity(AgentModel model) {

        if (model == null) {
            return null;
        }

        return AgentEntity.builder()
                .agentId(model.getAgentId())
                .localAgentId(model.getLocalAgentId())
                .agentName(model.getAgentName())
                .pairingCode(model.getPairingCode())
                .connectionStatus(model.getConnectionStatus())
                .build();

    }

}