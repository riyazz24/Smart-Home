package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.response.GetInstalledBindingHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.mqtt.dto.request.MqttBrokerRequest;
import com.example.smart.home.automation.mqtt.publisher.MqttPublisher;
import com.example.smart.home.automation.mqtt.topics.MqttTopics;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.service.BindingService;
import com.example.smart.home.automation.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BindingUseCase {

    private final BindingService bindingService;
    private final MqttPublisher mqttPublisher;

    public BindingUseCase(
            BindingService bindingService,
            MqttPublisher mqttPublisher) {
        this.bindingService = bindingService;
        this.mqttPublisher = mqttPublisher;
    }

    public TriggerHttpResponse installBindingEvent(String addonId) {

        MqttBrokerRequest<Void> mqttBrokerRequest = MqttBrokerRequest.<Void>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.BINDING_INSTALL)
                .addonId(addonId)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.BINDING_TOPIC, mqttBrokerRequest);

        log.info("\n \n BINDING INSTALL EVENT TRIGGERED - ADDON-ID: {} \n", addonId);

        return new TriggerHttpResponse("Binding install event triggered successfully");

    }

    public TriggerHttpResponse uninstallBindingEvent(String addonId) {

        MqttBrokerRequest<Void> mqttBrokerRequest = MqttBrokerRequest.<Void>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.BINDING_UNINSTALL)
                .addonId(addonId)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.BINDING_TOPIC, mqttBrokerRequest);

        log.info("\n \n BINDING UNINSTALL EVENT TRIGGERED - ADDON-ID: {} \n", addonId);

        return new TriggerHttpResponse("Binding uninstall event triggered successfully");

    }

    public GetInstalledBindingHttpResponse getBindingList() {

        return new GetInstalledBindingHttpResponse(bindingService.getBindingList());

    }

}