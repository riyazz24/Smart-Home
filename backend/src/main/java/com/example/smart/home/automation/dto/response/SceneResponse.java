package com.example.smart.home.automation.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SceneResponse {

    private String ruleName;

    private String status;

    private String fromTime;

    private String toTime;

    private List<String> days;

    private String deviceId;

    private String command;

    private String startRuleUid;

    private String endRuleUid;

}