package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.dto.response.AgentListResponse;
import com.example.smart.home.automation.entity.AgentEntity;
import com.example.smart.home.automation.entity.UserEntity;
import com.example.smart.home.automation.enums.ConnectionStatus;
import com.example.smart.home.automation.exception.ConflictException;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.exception.UnauthorizedException;
import com.example.smart.home.automation.jpaRepository.AgentJpaRepository;
import com.example.smart.home.automation.jpaRepository.UserJpaRepository;
import com.example.smart.home.automation.mapper.LocalAgentMapper;
import com.example.smart.home.automation.model.AgentModel;
import com.example.smart.home.automation.repository.AgentRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AgentRepositoryImpl implements AgentRepository {

    private final AgentJpaRepository agentJpaRepository;
    private final UserJpaRepository userJpaRepository;

    public AgentRepositoryImpl(
            AgentJpaRepository agentJpaRepository,
            UserJpaRepository userJpaRepository) {
        this.agentJpaRepository = agentJpaRepository;
        this.userJpaRepository = userJpaRepository;
    }

    @Override
    public String save(AgentModel model) {

        agentJpaRepository.save(LocalAgentMapper.toEntity(model));

        return model.getAgentId();

    }

    @Override
    public String setUserIdByPairingCode(String userId, String agentName, String pairingCode) {

        if (agentJpaRepository.existsByAgentName(agentName)) {
            throw new ConflictException("Agent name already exist");
        }

        AgentEntity agentEntity = agentJpaRepository.findByPairingCode(pairingCode)
                .orElseThrow(() -> new NotFoundException("Agent not found"));

        UserEntity userEntity = userJpaRepository.findByUserId(userId)
                .orElseThrow(() -> new UnauthorizedException("Authentication required"));

        agentEntity.setUserEntity(userEntity);
        agentEntity.setAgentName(agentName);
        agentEntity.setPairingCode(null);
        agentEntity.setConnectionStatus(ConnectionStatus.LINKED);

        agentJpaRepository.save(agentEntity);

        return agentEntity.getLocalAgentId();

    }

    @Override
    public boolean existsAgentByUserId(String userId) {

        return agentJpaRepository.existsByUserEntity_UserId(userId);

    }

    @Override
    public String findLocalAgentIdByUserId(String userId) {

        return agentJpaRepository.findLocalAgentIdByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Local agent not found"));

    }

    @Override
    public ConnectionStatus findAgentConnectionStatusByLocalAgentId(String localAgentId) {

        return agentJpaRepository.findAgentConnectionStatusByLocalAgentId(localAgentId)
                .orElseThrow(() -> new NotFoundException("Agent not found"));

    }

    @Override
    public List<AgentListResponse> findAllAgentByUserId(String userId) {

        return agentJpaRepository.findByUserEntity_UserId(userId)
                .stream()
                .map(agentInfoEntity -> new AgentListResponse(
                        agentInfoEntity.getAgentId(),
                        agentInfoEntity.getAgentName())
                )
                .toList();

    }

}