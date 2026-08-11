package com.example.smart.home.automation.mqtt.publisher;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class MqttPublisher {

    private final MqttClient mqttClient;
    private final ObjectMapper objectMapper;

    public MqttPublisher(
            MqttClient mqttClient,
            ObjectMapper objectMapper) {
        this.mqttClient = mqttClient;
        this.objectMapper = objectMapper;
    }

    public void publish(String topic, Object payload) {

        if (!mqttClient.isConnected()) {

            log.warn("\n \n MQTT BROKER NOT CONNECTED \n");

            return;

        }

        try {

            String json = objectMapper.writeValueAsString(payload);

            MqttMessage mqttMessage = new MqttMessage(json.getBytes(StandardCharsets.UTF_8));
            mqttMessage.setQos(1);
            mqttMessage.setRetained(false);

            log.debug("\n \n SEND TO MQTT BROKER - TOPIC: {} PAYLOAD: {} \n", topic, json);

            mqttClient.publish(topic, mqttMessage);

        } catch (JsonProcessingException e) {

            log.error("\n \n JSON SERIALIZATION FAILED - TOPIC: {} \n", topic);
            throw new RuntimeException(e);

        } catch (MqttException e) {

            log.error("\n \n FAILED TO SEND MQTT BROKER - TOPIC: {} \n", topic);
            throw new RuntimeException(e);

        }

    }

}

//    public void publishCreateThing(OpenhabAddThingPayload dto) throws Exception {
//
//        String payload = objectMapper.writeValueAsString(dto);
//
//        mqttClient.publish("agent/thing/create", new MqttMessage(payload.getBytes()));
//    }