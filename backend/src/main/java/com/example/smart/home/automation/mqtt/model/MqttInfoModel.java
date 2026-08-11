package com.example.smart.home.automation.mqtt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Getter
@AllArgsConstructor
@Jacksonized
@Builder
public class MqttInfoModel {

    private String mqttClientId;

}