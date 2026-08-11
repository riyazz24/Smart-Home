package com.example.smart.home.automation.mqtt.subscriber;

import com.example.smart.home.automation.mqtt.topics.MqttTopics;
import com.example.smart.home.automation.openhab.eventHandler.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.function.Consumer;

@Component
@Slf4j
public class MqttSubscriber {

    private final MqttClient mqttClient;
    private final BindingHandler bindingHandler;
    private final ScanHandler scanHandler;
    private final CreateThingHandler createThingHandler;
    private final ControlThingHandler controlThingHandler;
    private final CreateRuleHandler createRuleHandler;
    private final EnableRuleHandler enableRuleHandler;
    private final DeleteRuleHandler deleteRuleHandler;

    public MqttSubscriber(
            MqttClient mqttClient,
            BindingHandler bindingHandler,
            ScanHandler scanHandler,
            CreateThingHandler createThingHandler,
            ControlThingHandler controlThingHandler,
            CreateRuleHandler createRuleHandler,
            EnableRuleHandler enableRuleHandler,
            DeleteRuleHandler deleteRuleHandler) {
        this.mqttClient = mqttClient;
        this.bindingHandler = bindingHandler;
        this.scanHandler = scanHandler;
        this.createThingHandler = createThingHandler;
        this.controlThingHandler = controlThingHandler;
        this.createRuleHandler = createRuleHandler;
        this.enableRuleHandler = enableRuleHandler;
        this.deleteRuleHandler = deleteRuleHandler;
    }

    @PostConstruct
    public void subscribe() {

        subscribe(MqttTopics.Subscribe.OPENHAB_EVENT_TOPIC, bindingHandler::handle);

        subscribe(MqttTopics.Subscribe.SCAN_TOPIC, scanHandler::handle);

        subscribe(MqttTopics.Subscribe.CREATE_THING_TOPIC, createThingHandler::handle);

        subscribe(MqttTopics.Subscribe.CONTROL_THING_TOPIC, controlThingHandler::handle);

        subscribe(MqttTopics.Subscribe.CREATE_RULE_TOPIC, createRuleHandler::handle);

        subscribe(MqttTopics.Subscribe.ENABLE_RULE_TOPIC, enableRuleHandler::handle);

        subscribe(MqttTopics.Subscribe.DELETE_RULE_TOPIC, deleteRuleHandler::handle);

    }

    private void subscribe(String topic, Consumer<String> handler) {

        if (!mqttClient.isConnected()) {

            log.warn("\n \n MQTT BROKER NOT CONNECTED \n");

            return;

        }

        try {

            mqttClient.subscribe(topic, (t, message) -> {

                String payload = new String(message.getPayload(), StandardCharsets.UTF_8);

                log.debug("\n \n RECEIVED FROM MQTT BROKER - TOPIC: {} PAYLOAD: {} \n", t, payload);

                handler.accept(payload);

            });

        } catch (MqttException e) {

            log.error("\n \n FAILED TO RECEIVE FROM MQTT BROKER - TOPIC: {} \n", topic);
            throw new RuntimeException(e);

        }

    }

}