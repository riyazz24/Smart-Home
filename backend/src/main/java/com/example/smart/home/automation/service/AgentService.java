package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.AgentListResponse;
import com.example.smart.home.automation.enums.ConnectionStatus;

import java.util.List;

public interface AgentService {

    String createAgent(String localAgentId, String pairingCode);

    String setUserIdByPairingCode(String userId, String agentName, String pairingCode);

    boolean existsAgentByUserId(String userId);

    String getLocalAgentIdByUserId(String userId);

    ConnectionStatus getAgentConnectionStatusByLocalAgentId(String localAgentId);

    List<AgentListResponse> getAllAgentByUserId(String userId);

}