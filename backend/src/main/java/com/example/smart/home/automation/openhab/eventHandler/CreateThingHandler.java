package com.example.smart.home.automation.openhab.eventHandler;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.model.ThingModel;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabAddThingPayload;
import com.example.smart.home.automation.openhab.payload.ThingResultPayload;
import com.example.smart.home.automation.service.ThingService;
import com.example.smart.home.automation.websocket.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CreateThingHandler {

    private final ObjectMapper objectMapper;
    private final ThingService thingService;
    private final WebSocketService webSocketService;

    public CreateThingHandler(
            ObjectMapper objectMapper, ThingService thingService,
            WebSocketService webSocketService) {
        this.objectMapper = objectMapper;
        this.thingService = thingService;
        this.webSocketService = webSocketService;
    }

    public void handle(String payload) {

        try {

            OpenhabAddThingPayload openhabAddThingPayload = objectMapper.readValue(payload, OpenhabAddThingPayload.class);

            OpenhabEvent openhabEvent = OpenhabEvent.valueOf(openhabAddThingPayload.getOpenhabEvent().name());

            switch (openhabEvent) {

                case CREATE_THING -> {

                    ThingModel model = ThingModel.builder()
                            .roomId(openhabAddThingPayload.getRoomId())
                            .thingUid(openhabAddThingPayload.getThingUID())
                            .thingTypeUid(openhabAddThingPayload.getThingTypeUID())
                            .label(openhabAddThingPayload.getLabel())
                            .ipAddress((String) openhabAddThingPayload.getConfiguration().get("ipAddress"))
                            .macAddress((String) openhabAddThingPayload.getConfiguration().get("macAddress"))
                            .thingItemsModelList(openhabAddThingPayload.getThingItemsModelList())
                            .build();

                    thingService.createThing(model);

                    ThingResultPayload thingResultPayload = ThingResultPayload.builder()
                            .message("Your device " + model.getLabel() + " added successfully")
                            .build();

                    webSocketService.thingCreateResult(thingResultPayload);

                    log.info("\n \n THING CREATED - THING-UID: {} \n", openhabAddThingPayload.getThingUID());

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE CREATE THING \n", e);

        }

    }

}