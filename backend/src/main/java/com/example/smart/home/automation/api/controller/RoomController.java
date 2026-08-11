package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.CreateRoomHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateRoomHttpRequest;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetRoomListHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.useCase.RoomUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/room")
public class RoomController {

    private final RoomUseCase roomUseCase;

    public RoomController(
            RoomUseCase roomUseCase) {
        this.roomUseCase = roomUseCase;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CreateHttpResponse> createRoom(@Valid @RequestBody CreateRoomHttpRequest request, @RequestHeader(value = "X-AgentId") String agentId) {

        return ResponseEntity.ok(roomUseCase.createRoom(request, agentId));

    }

    @PatchMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UpdateHttpResponse> updateRoom(@Valid @RequestBody UpdateRoomHttpRequest request, @RequestHeader(value = "X-RoomId") String roomId, @RequestHeader(value = "X-AgentId") String agentId) {

        return ResponseEntity.ok(roomUseCase.updateRoom(request, roomId, agentId));

    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DeleteHttpResponse> deleteRoom(@RequestHeader(value = "X-RoomId") String roomId, @RequestHeader(value = "X-AgentId") String agentId) {

        return ResponseEntity.ok(roomUseCase.deleteRoom(roomId, agentId));

    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetRoomListHttpResponse> getRoomList(@RequestHeader(value = "X-AgentId") String agentId) {

        return ResponseEntity.ok(roomUseCase.getRoomList(agentId));

    }

}