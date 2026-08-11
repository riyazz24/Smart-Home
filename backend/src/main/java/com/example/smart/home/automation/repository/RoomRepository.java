package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.dto.response.RoomListResponse;
import com.example.smart.home.automation.model.RoomModel;

import java.util.List;

public interface RoomRepository {

    String save(RoomModel model);

    void updateRoomByRoomIdAndAgentId(String roomId, String agentId, String roomName);

    void deleteRoomByRoomIdAndAgentId(String roomId, String agentId);

    boolean existsRoomByRoomName(String roomName);

    List<RoomListResponse> findAllRoomByAgentId(String agentId);

}