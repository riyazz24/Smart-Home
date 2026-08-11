package com.example.smart.home.automation.mqtt.configuration;

import com.example.smart.home.automation.mqtt.service.MqttService;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    private final MqttService mqttService;
    private final String mqttBrokerUrl;
    private final String mqttBrokerUsername;
    private final String mqttBrokerPassword;

    public MqttConfig(
            MqttService mqttService,
            @Value("${mqtt.broker.url}") String mqttBrokerUrl,
            @Value("${mqtt.broker.username}") String mqttBrokerUsername,
            @Value("${mqtt.broker.password}") String mqttBrokerPassword) {
        this.mqttService = mqttService;
        this.mqttBrokerUrl = mqttBrokerUrl;
        this.mqttBrokerUsername = mqttBrokerUsername;
        this.mqttBrokerPassword = mqttBrokerPassword;
    }

    @Bean
    public MqttConnectOptions mqttConnectOptions() {

        MqttConnectOptions mqttConnectOptions = new MqttConnectOptions();
        mqttConnectOptions.setUserName(mqttBrokerUsername);
        mqttConnectOptions.setPassword(mqttBrokerPassword.toCharArray());
        mqttConnectOptions.setAutomaticReconnect(true);
        mqttConnectOptions.setCleanSession(false);
        mqttConnectOptions.setConnectionTimeout(30);
        mqttConnectOptions.setKeepAliveInterval(60);

        return mqttConnectOptions;

    }

    @Bean
    public MqttClient mqttClient(MqttConnectOptions mqttConnectOptions) throws MqttException {

        MqttClient mqttClient = new MqttClient(mqttBrokerUrl, mqttService.getMqttClientId(), new MemoryPersistence());

        mqttClient.connect(mqttConnectOptions);

        return mqttClient;

    }

}