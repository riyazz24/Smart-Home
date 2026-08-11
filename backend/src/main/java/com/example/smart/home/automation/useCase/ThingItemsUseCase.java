package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.ControlThingHttpRequest;
import com.example.smart.home.automation.mqtt.dto.request.MqttBrokerRequest;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.model.ThingItemsModel;
import com.example.smart.home.automation.mqtt.publisher.MqttPublisher;
import com.example.smart.home.automation.mqtt.topics.MqttTopics;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabControlThingPayload;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.AgentService;
import com.example.smart.home.automation.service.ThingItemsService;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Slf4j
public class ThingItemsUseCase {

    private final AgentService agentService;
    private final ThingItemsService thingItemsService;
    private final JwtService jwtService;
    private final MqttPublisher mqttPublisher;

    public ThingItemsUseCase(
            AgentService agentService,
            ThingItemsService thingItemsService,
            JwtService jwtService,
            MqttPublisher mqttPublisher) {
        this.agentService = agentService;
        this.thingItemsService = thingItemsService;
        this.jwtService = jwtService;
        this.mqttPublisher = mqttPublisher;
    }

    public TriggerHttpResponse thingControlEvent(String thingUID, String channelId, ControlThingHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        ThingItemsModel thingItemsModel = thingItemsService.getThingItemsByThingUIDAndChannelId(thingUID, channelId);

        OpenhabControlThingPayload openhabControlThingPayload = OpenhabControlThingPayload.builder()
                .thingUID(thingUID)
                .itemName(thingItemsModel.getItemName())
                .channelId(thingItemsModel.getChannelId())
                .command(request.getCommand())
                .build();

        MqttBrokerRequest<OpenhabControlThingPayload> mqttBrokerRequest = MqttBrokerRequest.<OpenhabControlThingPayload>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.CONTROL_THING)
                .payload(openhabControlThingPayload)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.controlThing(localAgentId), mqttBrokerRequest);

        log.info("\n \n CONTROL THING EVENT TRIGGERED - THING-UID: {} AND CHANNEL-ID: {} \n", thingUID, channelId);

        return new TriggerHttpResponse("Control thing event triggered successfully");

    }

    private String getCookieValue(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "ACCESS_TOKEN".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

}