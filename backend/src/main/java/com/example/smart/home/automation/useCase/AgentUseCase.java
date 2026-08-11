package com.example.smart.home.automation.useCase;

import com.example.smart.home.automation.api.dto.request.CreateAgentHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateAgentHttpRequest;
import com.example.smart.home.automation.api.dto.response.AgentListHttpResponse;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.enums.ConnectionStatus;
import com.example.smart.home.automation.manager.SseConnectionManager;
import com.example.smart.home.automation.security.jwt.JwtService;
import com.example.smart.home.automation.service.AgentService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Arrays;

@Component
@Slf4j
public class AgentUseCase {

    private final AgentService agentService;
    private final JwtService jwtService;
    private final SseConnectionManager sseConnectionManager;

    public AgentUseCase(
            AgentService agentService,
            JwtService jwtService,
            SseConnectionManager sseConnectionManager) {
        this.agentService = agentService;
        this.jwtService = jwtService;
        this.sseConnectionManager = sseConnectionManager;
    }

    @Transactional
    public CreateHttpResponse createAgent(CreateAgentHttpRequest request, String localAgentId) {

        String agentId = agentService.createAgent(localAgentId, request.getPairingCode());

        log.info("\n \n AGENT CREATED - AGENT-ID: {} \n", agentId);

        return new CreateHttpResponse("Agent created successfully");

    }

    @Transactional
    public UpdateHttpResponse updateAgent(UpdateAgentHttpRequest request, HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        String userId = jwtService.extractUserId(accessToken);

        String localAgentId = agentService.setUserIdByPairingCode(userId, request.getAgentName(), request.getPairingCode());

        sseConnectionManager.notifyLinked(localAgentId);

        log.info("\n \n USER LINKED TO AGENT - AGENT-ID: {}, USER-ID: {} \n", localAgentId, userId);

        return new UpdateHttpResponse("Agent updated successfully");

    }

    public Boolean existsAgentByUserId(HttpServletRequest httpServletRequest) {

        String accessToken = getCookieValue(httpServletRequest);

        return agentService.existsAgentByUserId(jwtService.extractUserId(accessToken));

    }

    public SseEmitter getAgentConnectionStatus(String localAgentId) {

        SseEmitter sseEmitter = sseConnectionManager.addEmitter(localAgentId);

        if (agentService.getAgentConnectionStatusByLocalAgentId(localAgentId) == ConnectionStatus.LINKED) {
            sseConnectionManager.notifyLinked(localAgentId);
        }

        return sseEmitter;

    }

    public AgentListHttpResponse getAgentList(HttpServletRequest request) {

        String accessToken = getCookieValue(request);

        String userId = jwtService.extractUserId(accessToken);

        return new AgentListHttpResponse(agentService.getAllAgentByUserId(userId));

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