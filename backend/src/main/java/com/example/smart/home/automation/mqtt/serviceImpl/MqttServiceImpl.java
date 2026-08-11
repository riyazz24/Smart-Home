package com.example.smart.home.automation.mqtt.serviceImpl;

import com.example.smart.home.automation.mqtt.model.MqttInfoModel;
import com.example.smart.home.automation.mqtt.service.MqttService;
import com.example.smart.home.automation.util.Helper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MqttServiceImpl implements MqttService {

    private static final Path MQTT_INFO_FILE_PATH = Paths.get("mqtt-details/mqtt-info.json");

    private final ObjectMapper objectMapper;

    public MqttServiceImpl(
            ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public String getMqttClientId() {

        return createOrLoadMqttInfo().getMqttClientId();

    }

    /**
     * HELPER METHODS
     */
    private MqttInfoModel createOrLoadMqttInfo() {

        try {

            if (Files.exists(MQTT_INFO_FILE_PATH)) {
                return objectMapper.readValue(MQTT_INFO_FILE_PATH.toFile(), MqttInfoModel.class);
            }

            Files.createDirectories(MQTT_INFO_FILE_PATH.getParent());

            MqttInfoModel mqttInfoModel = MqttInfoModel.builder()
                    .mqttClientId(Helper.getRandomStringOfLength16())
                    .build();

            objectMapper.writeValue(MQTT_INFO_FILE_PATH.toFile(), mqttInfoModel);

            return mqttInfoModel;

        } catch (Exception e) {

            throw new RuntimeException("Failed to create mqtt details", e);

        }

    }

}