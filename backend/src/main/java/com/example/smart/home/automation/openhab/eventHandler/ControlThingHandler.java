package com.example.smart.home.automation.openhab.eventHandler;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabControlThingPayload;
import com.example.smart.home.automation.openhab.payload.ThingResultPayload;
import com.example.smart.home.automation.websocket.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ControlThingHandler {

    private final ObjectMapper objectMapper;
    private final WebSocketService webSocketService;

    public ControlThingHandler(
            ObjectMapper objectMapper,
            WebSocketService webSocketService) {
        this.objectMapper = objectMapper;
        this.webSocketService = webSocketService;
    }

    public void handle(String payload) {

        try {

            OpenhabControlThingPayload openhabControlThingPayload = objectMapper.readValue(payload, OpenhabControlThingPayload.class);

            OpenhabEvent openhabEvent = OpenhabEvent.valueOf(openhabControlThingPayload.getOpenhabEvent().name());

            switch (openhabEvent) {

                case CONTROL_THING -> {

                    ThingResultPayload thingResultPayload = ThingResultPayload.builder()
                            .status(openhabControlThingPayload.isStatus())
                            .message("Bulb is ON")
                            .build();

                    webSocketService.thingControlResult(thingResultPayload);

                    log.info("\n \n THING-UID: {} AND THING STATUS: {} \n", openhabControlThingPayload.getThingUID(), openhabControlThingPayload.isStatus());

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE CONTROL THING \n", e);

        }

    }

}