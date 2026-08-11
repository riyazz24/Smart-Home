package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.AgentListResponse;
import com.example.smart.home.automation.enums.ConnectionStatus;
import com.example.smart.home.automation.model.AgentModel;
import com.example.smart.home.automation.repository.AgentRepository;
import com.example.smart.home.automation.service.AgentService;
import com.example.smart.home.automation.util.Helper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;

    public AgentServiceImpl(
            AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    @Override
    public String createAgent(String localAgentId, String pairingCode) {

        AgentModel model = AgentModel.builder()
                .agentId(Helper.getRandomStringOfLength16())
                .localAgentId(localAgentId)
                .agentName(null)
                .pairingCode(pairingCode)
                .userId(null)
                .connectionStatus(ConnectionStatus.UNLINKED)
                .build();

        return agentRepository.save(model);

    }

    @Override
    public String setUserIdByPairingCode(String userId, String agentName, String pairingCode) {

        return agentRepository.setUserIdByPairingCode(userId, agentName, pairingCode);

    }

    @Override
    public boolean existsAgentByUserId(String userId) {

        return agentRepository.existsAgentByUserId(userId);

    }

    @Override
    public String getLocalAgentIdByUserId(String userId) {

        return agentRepository.findLocalAgentIdByUserId(userId);

    }

    @Override
    public ConnectionStatus getAgentConnectionStatusByLocalAgentId(String localAgentId) {

        return agentRepository.findAgentConnectionStatusByLocalAgentId(localAgentId);

    }

    @Override
    public List<AgentListResponse> getAllAgentByUserId(String userId) {

        return agentRepository.findAllAgentByUserId(userId);

    }

}