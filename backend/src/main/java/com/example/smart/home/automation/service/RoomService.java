package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.RoomListResponse;

import java.util.List;

public interface RoomService {

    String createRoom(String agentId, String roomName);

    void updateRoomByRoomIdAndAgentId(String roomId, String agentId, String roomName);

    void deleteRoomByRoomIdAndAgentId(String roomId, String agentId);

    List<RoomListResponse> getAllRoomByAgentId(String agentId);

}