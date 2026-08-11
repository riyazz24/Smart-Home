package com.example.smart.home.automation.openhab.eventHandler;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabInboxPayload;
import com.example.smart.home.automation.openhab.payload.ScanResultPayload;
import com.example.smart.home.automation.websocket.service.WebSocketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ScanHandler {

    private final ObjectMapper objectMapper;
    private final WebSocketService webSocketService;

    public ScanHandler(
            ObjectMapper objectMapper,
            WebSocketService webSocketService) {
        this.objectMapper = objectMapper;
        this.webSocketService = webSocketService;
    }

    public void handle(String payload) {

        try {

            List<OpenhabInboxPayload> openhabInboxPayloadList = objectMapper.readerForListOf(OpenhabInboxPayload.class).readValue(payload);

            OpenhabEvent openhabEvent = OpenhabEvent.valueOf(openhabInboxPayloadList.get(0).getOpenhabEvent().name());

            switch (openhabEvent) {

                case SCAN -> {

                    StringBuilder devices = new StringBuilder("\n \n DEVICES FOUND ON SCAN: \n");

                    for (OpenhabInboxPayload openhabInboxPayload : openhabInboxPayloadList) {
                        devices.append("\n").append(openhabInboxPayload.getLabel()).append("\n");
                    }

                    log.info(String.valueOf(devices));


                    List<ScanResultPayload> scanResultPayloadList = openhabInboxPayloadList.stream()
                            .map(device -> ScanResultPayload.builder()
                                    .thingUid(device.getThingUID())
                                    .thingTypeUid(device.getThingTypeUID())
                                    .label(device.getLabel())
                                    .bridgeUid(device.getBridgeUID())
                                    .properties(device.getProperties())
                                    .representationProperty(device.getRepresentationProperty())
                                    .build())
                            .toList();

                    webSocketService.scanResult(scanResultPayloadList);

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE SCAN \n", e);

        }

    }

}