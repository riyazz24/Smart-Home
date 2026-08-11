package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.CreateThingHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateThingHttpRequest;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetThingListHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.mqtt.dto.request.MqttBrokerRequest;
import com.example.smart.home.automation.mqtt.publisher.MqttPublisher;
import com.example.smart.home.automation.mqtt.topics.MqttTopics;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabAddThingPayload;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.AgentService;
import com.example.smart.home.automation.service.ThingService;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class ThingsUseCase {

    private final AgentService agentService;
    private final JwtService jwtService;
    private final MqttPublisher mqttPublisher;
    private final ThingService thingService;
    
    public ThingsUseCase(
            AgentService agentService,
            JwtService jwtService,
            MqttPublisher mqttPublisher,
            ThingService thingService) {
        this.agentService = agentService;
        this.jwtService = jwtService;
        this.mqttPublisher = mqttPublisher;
        this.thingService = thingService;
    }

    public TriggerHttpResponse thingScanEvent(String binding, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        MqttBrokerRequest<Void> mqttBrokerRequest = MqttBrokerRequest.<Void>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.SCAN)
                .binding(binding)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.scan(localAgentId), mqttBrokerRequest);

        log.info("\n \n SCAN EVENT TRIGGERED - BINDING: {} \n", binding);

        return new TriggerHttpResponse("Scan event triggered successfully");

    }

    public TriggerHttpResponse thingCreateEvent(CreateThingHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        Map<String, Object> configuration = new HashMap<>();

        if (request.getThingTypeUid().equals("wiz:color-bulb")) {

            configuration.put("ipAddress", request.getIpAddress());
            configuration.put("macAddress", request.getMacAddress());

        } else {

            throw new NotFoundException("Unsupported device type");

        }

        OpenhabAddThingPayload openHabAddThingPayload = OpenhabAddThingPayload.builder()
                .roomId(request.getRoomId())
                .thingTypeUID(request.getThingTypeUid())
                .label(request.getLabel())
                .configuration(configuration)
                .build();

        MqttBrokerRequest<OpenhabAddThingPayload> mqttBrokerRequest = MqttBrokerRequest.<OpenhabAddThingPayload>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.CREATE_THING)
                .payload(openHabAddThingPayload)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.createThing(localAgentId), mqttBrokerRequest);

        log.info("\n \n THING CREATE EVENT TRIGGERED - THING-TYPE-UID: {} \n", request.getThingTypeUid());

        return new TriggerHttpResponse("Thing create event triggered successfully");

    }

	public GetThingListHttpResponse getThingList(String agentId, String roomId, HttpServletRequest httpServletRequest) {
		
		String accessToken = getCookieValue(httpServletRequest);
		
		String userId = jwtService.extractUserId(accessToken);

		return new GetThingListHttpResponse(thingService.getAllThings(agentId, userId, roomId));
	}
    
	// add this method (anywhere inside the class, e.g. after getThingList)
	@Transactional
	public DeleteHttpResponse deleteThing(String thingId, HttpServletRequest httpServletRequest) {

	    String accessToken = getCookieValue(httpServletRequest);

	    String userId = jwtService.extractUserId(accessToken);

	    // Deletes the device, its channels, and any rules/schedulers referencing
	    // those channels as a single atomic unit — if any step fails, everything
	    // (including channel/rule deletions already issued) rolls back together.
	    thingService.deleteThingByThingUIDAndUserId(thingId, userId);

	    log.info("\n \n THING DELETED - THING-UID: {} \n", Helper.sanitizeId(thingId));

	    return new DeleteHttpResponse("Device deleted successfully.");

	}
	
	@Transactional
	public TriggerHttpResponse updateThing(String thingId, UpdateThingHttpRequest request, HttpServletRequest httpServletRequest) {

	    String accessToken = getCookieValue(httpServletRequest);

	    String userId = jwtService.extractUserId(accessToken);

	    thingService.updateThingLabel(thingId, userId, request.getLabel().trim());

	    log.info("\n \n THING RENAMED - THING-UID: {} \n", Helper.sanitizeId(thingId));

	    return new TriggerHttpResponse("Device renamed successfully.");

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