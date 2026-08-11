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
public class DeleteRuleHandler {

    private final ObjectMapper objectMapper;
    private final RuleService ruleService;
    private final WebSocketService webSocketService;

    public DeleteRuleHandler(
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

                case DELETE_RULE -> {

                    ruleService.deleteRuleByRuleUid(openhabRulePayload.getRuleUID());

                    ThingResultPayload resultPayload = ThingResultPayload.builder()
                            .message(Objects.equals(openhabRulePayload.getStatus(), "ENABLE") ?
                                    "Rule deleted: " + openhabRulePayload.getRuleUID() :
                                    "Rule deletion failed: " + openhabRulePayload.getErrorMessage())
                            .build();

                    webSocketService.ruleDeleteResult(resultPayload);

                    log.info("\n \n RULE DELETED - RULE-UID: {} \n", openhabRulePayload.getRuleUID());

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE DELETE RULE \n", e);

        }

    }

}