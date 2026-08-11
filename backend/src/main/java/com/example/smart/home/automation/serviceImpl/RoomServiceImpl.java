package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.RoomListResponse;
import com.example.smart.home.automation.exception.ConflictException;
import com.example.smart.home.automation.model.RoomModel;
import com.example.smart.home.automation.repository.RoomRepository;
import com.example.smart.home.automation.service.RoomService;
import com.example.smart.home.automation.util.Helper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(
            RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public String createRoom(String agentId, String roomName) {

        if (roomRepository.existsRoomByRoomName(roomName)) {
            throw new ConflictException("Room name already exists");
        }

        RoomModel model = RoomModel.builder()
                .roomId(Helper.getRandomStringOfLength16())
                .agentId(agentId)
                .roomName(roomName)
                .build();

        return roomRepository.save(model);

    }

    @Override
    public void updateRoomByRoomIdAndAgentId(String roomId, String agentId, String roomName) {

        if (roomRepository.existsRoomByRoomName(roomName)) {
            throw new ConflictException("Room name already exists");
        }

        roomRepository.updateRoomByRoomIdAndAgentId(roomId, agentId, roomName);

    }

    @Override
    public void deleteRoomByRoomIdAndAgentId(String roomId, String agentId) {

        roomRepository.deleteRoomByRoomIdAndAgentId(roomId, agentId);

    }

    @Override
    public List<RoomListResponse> getAllRoomByAgentId(String agentId) {

        return roomRepository.findAllRoomByAgentId(agentId);

    }

}