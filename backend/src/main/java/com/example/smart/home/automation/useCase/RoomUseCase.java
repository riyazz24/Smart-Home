package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.CreateRoomHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateRoomHttpRequest;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetRoomListHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.service.RoomService;
import com.example.smart.home.automation.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
public class RoomUseCase {

    private final RoomService roomService;

    public RoomUseCase(
            RoomService roomService) {
        this.roomService = roomService;
    }

    @Transactional
    public CreateHttpResponse createRoom(CreateRoomHttpRequest request, String agentId) {

        String roomId = roomService.createRoom(agentId, request.getRoomName());

        log.info("\n \n ROOM CREATED - ROOM-ID: {}, AGENT-ID: {} \n", Helper.sanitizeId(roomId), Helper.sanitizeId(agentId));

        return new CreateHttpResponse("Room created successfully");

    }

    @Transactional
    public UpdateHttpResponse updateRoom(UpdateRoomHttpRequest request, String roomId, String agentId) {

        roomService.updateRoomByRoomIdAndAgentId(roomId, agentId, request.getRoomName());

        log.info("\n \n ROOM UPDATED - ROOM-ID: {}, AGENT-ID: {} \n", Helper.sanitizeId(roomId), Helper.sanitizeId(agentId));

        return new UpdateHttpResponse("Room name updated successfully");

    }

    @Transactional
    public DeleteHttpResponse deleteRoom(String roomId, String agentId) {

        roomService.deleteRoomByRoomIdAndAgentId(roomId, agentId);

        log.info("\n \n ROOM DELETED - ROOM-ID: {}, AGENT-ID: {} \n", Helper.sanitizeId(roomId), Helper.sanitizeId(agentId));

        return new DeleteHttpResponse("Room deleted successfully");

    }

    public GetRoomListHttpResponse getRoomList(String agentId) {

        return new GetRoomListHttpResponse(roomService.getAllRoomByAgentId(agentId));

    }

}