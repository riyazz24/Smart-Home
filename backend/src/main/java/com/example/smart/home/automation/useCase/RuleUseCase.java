package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.CreateRuleHttpRequest;
import com.example.smart.home.automation.api.dto.request.EnableRuleHttpRequest;
import com.example.smart.home.automation.api.dto.response.GetRuleListHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.mqtt.dto.request.MqttBrokerRequest;
import com.example.smart.home.automation.mqtt.publisher.MqttPublisher;
import com.example.smart.home.automation.mqtt.topics.MqttTopics;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.OpenhabRulePayload;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.AgentService;
import com.example.smart.home.automation.service.RuleService;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@Slf4j
public class RuleUseCase {

    private final AgentService agentService;
    private final RuleService ruleService;
    private final JwtService jwtService;
    private final MqttPublisher mqttPublisher;

    public RuleUseCase(
            AgentService agentService,
            RuleService ruleService,
            JwtService jwtService,
            MqttPublisher mqttPublisher) {
        this.agentService = agentService;
        this.ruleService = ruleService;
        this.jwtService = jwtService;
        this.mqttPublisher = mqttPublisher;
    }

    public TriggerHttpResponse createRuleEvent(CreateRuleHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        OpenhabRulePayload openhabRulePayload = OpenhabRulePayload.builder()
                .ruleUID(Helper.getRandomStringOfLength16())
                .ruleName(request.getRuleName())
                .triggerPayload(request.getTriggerPayload())
                .actionPayloadList(request.getActionPayloadList())
                .build();

        MqttBrokerRequest<OpenhabRulePayload> mqttBrokerRequest = MqttBrokerRequest.<OpenhabRulePayload>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.CREATE_RULE)
                .payload(openhabRulePayload)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.createRule(localAgentId), mqttBrokerRequest);

        log.info("\n \n CREATE RULE EVENT TRIGGERED - RULE-UID: {} \n", openhabRulePayload.getRuleUID());

        return new TriggerHttpResponse("Create rule event triggered successfully");

    }

    public TriggerHttpResponse enableRuleEvent(String ruleUID, EnableRuleHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        OpenhabRulePayload openhabRulePayload = OpenhabRulePayload.builder()
                .ruleUID(ruleUID)
                .status(request.getStatus())
                .build();

        MqttBrokerRequest<OpenhabRulePayload> mqttBrokerRequest = MqttBrokerRequest.<OpenhabRulePayload>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.ENABLE_RULE)
                .payload(openhabRulePayload)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.enableRule(localAgentId), mqttBrokerRequest);

        log.info("\n \n ENABLE RULE EVENT TRIGGERED - RULE-UID: {} ENABLED: {} \n", ruleUID, request.getStatus());

        return new TriggerHttpResponse("Enable rule event triggered successfully");

    }

    public TriggerHttpResponse deleteRuleEvent(String ruleUID, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String localAgentId = agentService.getLocalAgentIdByUserId(jwtService.extractUserId(accessToken));

        OpenhabRulePayload openhabRulePayload = OpenhabRulePayload.builder()
                .ruleUID(ruleUID)
                .build();

        MqttBrokerRequest<OpenhabRulePayload> mqttBrokerRequest = MqttBrokerRequest.<OpenhabRulePayload>builder()
                .requestId(Helper.getRandomStringOfLength16())
                .openhabEvent(OpenhabEvent.DELETE_RULE)
                .payload(openhabRulePayload)
                .build();

        mqttPublisher.publish(MqttTopics.Publish.deleteRule(localAgentId), mqttBrokerRequest);

        log.info("\n \n DELETE RULE EVENT TRIGGERED - RULE-UID: {} \n", ruleUID);

        return new TriggerHttpResponse("Delete rule event triggered successfully");

    }

    public GetRuleListHttpResponse getRuleList() {

        return new GetRuleListHttpResponse(ruleService.getRuleList());

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