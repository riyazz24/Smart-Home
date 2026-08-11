package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.dto.response.RoomListResponse;
import com.example.smart.home.automation.entity.AgentEntity;
import com.example.smart.home.automation.entity.RoomEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.jpaRepository.AgentJpaRepository;
import com.example.smart.home.automation.jpaRepository.RoomJpaRepository;
import com.example.smart.home.automation.mapper.RoomMapper;
import com.example.smart.home.automation.model.RoomModel;
import com.example.smart.home.automation.repository.RoomRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public class RoomRepositoryImpl implements RoomRepository {

    private final AgentJpaRepository agentJpaRepository;
    private final RoomJpaRepository roomJpaRepository;

    public RoomRepositoryImpl(
            AgentJpaRepository agentJpaRepository,
            RoomJpaRepository roomJpaRepository) {
        this.agentJpaRepository = agentJpaRepository;
        this.roomJpaRepository = roomJpaRepository;
    }

    @Override
    public String save(RoomModel model) {

        AgentEntity agentEntity = agentJpaRepository.findByAgentId(model.getAgentId())
                .orElseThrow(() -> new NotFoundException("Agent not found"));

        RoomEntity roomEntity = RoomMapper.toEntity(model);
        roomEntity.setAgentEntity(agentEntity);

        roomJpaRepository.save(roomEntity);

        return model.getRoomId();

    }

    @Override
    public void updateRoomByRoomIdAndAgentId(String roomId, String agentId, String roomName) {

        int updated = roomJpaRepository.updateRoomNameByRoomIdAndAgentEntity_AgentId(roomId, agentId, roomName, Instant.now());

        if (updated == 0) {
            throw new NotFoundException("Room not found");
        }

    }

    @Override
    public void deleteRoomByRoomIdAndAgentId(String roomId, String agentId) {

        int deleted = roomJpaRepository.deleteByRoomIdAndAgentEntity_AgentId(roomId, agentId);

        if (deleted == 0) {
            throw new NotFoundException("Room not found");
        }

    }

    @Override
    public boolean existsRoomByRoomName(String roomName) {

        return roomJpaRepository.existsByRoomName(roomName);

    }

    @Override
    public List<RoomListResponse> findAllRoomByAgentId(String agentId) {

        return roomJpaRepository.findByAgentEntity_AgentId(agentId)
                .stream()
                .map(roomEntity -> new RoomListResponse(
                        roomEntity.getRoomId(),
                        roomEntity.getRoomName())
                )
                .toList();

    }

}