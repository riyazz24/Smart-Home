package com.example.smart.home.automation.api.dto.response;

import com.example.smart.home.automation.dto.response.RoomListResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class GetRoomListHttpResponse {

    private List<RoomListResponse> roomList;

}