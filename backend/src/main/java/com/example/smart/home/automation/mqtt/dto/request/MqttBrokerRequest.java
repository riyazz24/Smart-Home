package com.example.smart.home.automation.mqtt.dto.request;

import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Getter
@AllArgsConstructor
@Jacksonized
@Builder
public class MqttBrokerRequest<T> {

    private String requestId;

    private OpenhabEvent openhabEvent;

    private String addonId;

    private String binding;

    private T payload;

}