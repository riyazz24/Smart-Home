package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.dto.response.AgentListResponse;
import com.example.smart.home.automation.enums.ConnectionStatus;
import com.example.smart.home.automation.model.AgentModel;

import java.util.List;

public interface AgentRepository {

    String save(AgentModel model);

    String setUserIdByPairingCode(String userId, String agentName, String pairingCode);

    boolean existsAgentByUserId(String userId);

    String findLocalAgentIdByUserId(String userId);

    ConnectionStatus findAgentConnectionStatusByLocalAgentId(String localAgentId);

    List<AgentListResponse> findAllAgentByUserId(String userId);

}