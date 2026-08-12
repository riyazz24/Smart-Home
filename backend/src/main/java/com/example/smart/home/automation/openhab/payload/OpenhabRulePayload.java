package com.example.smart.home.automation.openhab.payload;

import java.util.List;

import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenhabRulePayload {

    private String localAgentId;

    private OpenhabEvent openhabEvent;

    private String ruleUID;

    private String ruleName;

    private TriggerPayload triggerPayload;

    private List<ActionPayload> actionPayloadList;

    private String status;

    private String errorMessage;

    @Data
    public static class TriggerPayload {
        private String type;
        private String cronExpression;
        private String itemName;
        private String state;
    }

    @Data
    public static class ActionPayload {
        private String itemName;
        private String command;
    }

}