package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class RoomModel {

    private String roomId;

    private String agentId;

    private String roomName;

}