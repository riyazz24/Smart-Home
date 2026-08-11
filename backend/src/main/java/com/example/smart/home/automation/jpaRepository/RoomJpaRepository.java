package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RoomJpaRepository extends JpaRepository<RoomEntity, Long> {

    @Modifying(flushAutomatically = true)
    @Query("""
            UPDATE RoomEntity ref
            SET ref.roomName = :roomName,
            ref.updatedAt = :updatedAt
            WHERE ref.roomId = :roomId AND ref.agentEntity.agentId = :agentId
            """)
    int updateRoomNameByRoomIdAndAgentEntity_AgentId(
            @Param("roomId") String roomId,
            @Param("agentId") String agentId,
            @Param("roomName") String roomName,
            @Param("updatedAt") Instant updatedAt
    );

    int deleteByRoomIdAndAgentEntity_AgentId(String roomId, String agentId);

    boolean existsByRoomName(String roomName);

    List<RoomEntity> findByAgentEntity_AgentId(String agentId);

    Optional<RoomEntity> findByRoomId(String roomId);

}