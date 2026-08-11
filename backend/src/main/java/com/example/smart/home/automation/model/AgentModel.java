package com.example.smart.home.automation.model;

import com.example.smart.home.automation.enums.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class AgentModel {

    private String agentId;

    private String userId;

    private String localAgentId;

    private String agentName;

    private String pairingCode;

    private ConnectionStatus connectionStatus;

}