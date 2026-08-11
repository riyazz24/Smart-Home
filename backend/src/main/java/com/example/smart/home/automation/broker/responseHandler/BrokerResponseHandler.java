package com.example.smart.home.automation.broker.responseHandler;

import com.example.smart.home.automation.mqtt.dto.response.MqttResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BrokerResponseHandler {

    private final ObjectMapper objectMapper;

    public BrokerResponseHandler(
            ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void handle(String payload) {

        try {

            MqttResponse mqttResponse = objectMapper.readValue(payload, MqttResponse.class);

            if (!mqttResponse.isSuccess()) {
                log.error("\n \n AGENT ERROR: {} \n", mqttResponse.getError());
            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE AGENT RESPONSE \n");
            throw new RuntimeException(e);

        }

    }

}