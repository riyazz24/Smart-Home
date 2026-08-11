package com.example.smart.home.automation.jpaRepository;

import com.example.smart.home.automation.entity.ThingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ThingJpaRepository extends JpaRepository<ThingEntity, String> {

    List<ThingEntity> findAllByRoomEntity_AgentEntity_AgentIdAndRoomEntity_AgentEntity_UserEntity_UserId(@Param("agentId") String agentId, @Param("userId") String userId);
    List<ThingEntity> findAllByRoomEntity_RoomIdAndRoomEntity_AgentEntity_AgentIdAndRoomEntity_AgentEntity_UserEntity_UserId(@Param("roomId") String roomId, @Param("agentId") String agentId, @Param("userId") String userId);
    Optional<ThingEntity> findByThingUIDAndRoomEntity_AgentEntity_UserEntity_UserId(@Param("thingUID") String thingUID, @Param("userId") String userId);
}
