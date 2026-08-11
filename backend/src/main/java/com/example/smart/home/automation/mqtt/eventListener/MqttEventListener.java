package com.example.smart.home.automation.mqtt.eventListener;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MqttEventListener {

    private final MqttClient mqttClient;

    public MqttEventListener(
            MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

    @PostConstruct
    public void init() {

        mqttClient.setCallback(new MqttCallback() {

            @Override
            public void connectionLost(Throwable cause) {
                log.warn("\n \n MQTT CONNECTION LOST: {} \n", cause.getMessage());
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) {
                log.debug("\n \n RECEIVED FROM BROKER - TOPIC: {} PAYLOAD: {} \n", topic, new String(message.getPayload()));
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                log.info("\n \n DELIVERY COMPLETE: {} \n", token.getMessageId());
            }

        });

        log.info("\n \n MQTT SERVICE INITIALIZED, CLIENT CONNECTED: {} \n", mqttClient.isConnected());

    }

}