package com.example.smart.home.automation.websocket.service;

import com.example.smart.home.automation.openhab.payload.ScanResultPayload;
import com.example.smart.home.automation.openhab.payload.ThingResultPayload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(
            SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void scanResult(List<ScanResultPayload> deviceList) {

        messagingTemplate.convertAndSend("/topic/scan", deviceList);

    }

    public void thingCreateResult(ThingResultPayload devices) {

        messagingTemplate.convertAndSend("/topic/thing/create", devices);

    }

    public void thingControlResult(ThingResultPayload devices) {

        messagingTemplate.convertAndSend("/topic/thing/control", devices);

    }

    public void ruleCreateResult(ThingResultPayload devices) {

        messagingTemplate.convertAndSend("/topic/rule/create", devices);

    }

    public void ruleEnableResult(ThingResultPayload devices) {

        messagingTemplate.convertAndSend("/topic/rule/enable", devices);

    }

    public void ruleDeleteResult(ThingResultPayload devices) {

        messagingTemplate.convertAndSend("/topic/rule/delete", devices);

    }

}