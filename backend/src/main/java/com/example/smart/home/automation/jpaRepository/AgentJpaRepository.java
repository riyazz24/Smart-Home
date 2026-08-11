package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.AgentEntity;
import com.example.smart.home.automation.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AgentJpaRepository extends JpaRepository<AgentEntity, Long> {

    boolean existsByAgentName(String agentName);

    boolean existsByUserEntity_UserId(String userId);

    @Query("""
            SELECT ref.localAgentId
            FROM AgentEntity ref
            WHERE ref.userEntity.userId = :userId
            """)
    Optional<String> findLocalAgentIdByUserId(@Param("userId") String userId);

    @Query("""
            SELECT ref.connectionStatus
            FROM AgentEntity ref
            WHERE ref.localAgentId = :localAgentId
            """)
    Optional<ConnectionStatus> findAgentConnectionStatusByLocalAgentId(@Param("localAgentId") String localAgentId);

    Optional<AgentEntity> findByLocalAgentId(String localAgentId);

    Optional<AgentEntity> findByPairingCode(String pairingCode);

    List<AgentEntity> findByUserEntity_UserId(String userId);

    Optional<AgentEntity> findByAgentId(String agentId);

}