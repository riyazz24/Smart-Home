package com.example.smart.home.automation.openhab.eventHandler;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabRulePayload;
import com.example.smart.home.automation.openhab.payload.ThingResultPayload;
import com.example.smart.home.automation.service.RuleService;
import com.example.smart.home.automation.websocket.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@Slf4j
public class EnableRuleHandler {

    private final ObjectMapper objectMapper;
    private final RuleService ruleService;
    private final WebSocketService webSocketService;

    public EnableRuleHandler(
            ObjectMapper objectMapper,
            RuleService ruleService,
            WebSocketService webSocketService) {
        this.objectMapper = objectMapper;
        this.ruleService = ruleService;
        this.webSocketService = webSocketService;
    }

    public void handle(String payload) {

        try {

            OpenhabRulePayload openhabRulePayload = objectMapper.readValue(payload, OpenhabRulePayload.class);

            OpenhabEvent openhabEvent = OpenhabEvent.valueOf(openhabRulePayload.getOpenhabEvent().name());

            switch (openhabEvent) {

                case ENABLE_RULE -> {

                    ruleService.updateRuleByRuleUid(openhabRulePayload.getRuleUID(), openhabRulePayload.getStatus());

                    ThingResultPayload resultPayload = ThingResultPayload.builder()
                            .message(Objects.equals(openhabRulePayload.getStatus(), "ENABLE") ?
                                    "Rule " + "enabled" + ": " + openhabRulePayload.getRuleUID() :
                                    "Rule update failed: " + openhabRulePayload.getErrorMessage())
                            .build();

                    webSocketService.ruleEnableResult(resultPayload);

                    log.info("\n \n RULE {} - RULE-UID: {} \n", openhabRulePayload.getStatus(), openhabRulePayload.getRuleUID());

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE ENABLE RULE \n", e);

        }

    }

}