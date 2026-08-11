package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.CreateAgentHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateAgentHttpRequest;
import com.example.smart.home.automation.api.dto.response.AgentListHttpResponse;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.useCase.AgentUseCase;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentUseCase agentUseCase;

    public AgentController(
            AgentUseCase agentUseCase) {
        this.agentUseCase = agentUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateHttpResponse> createAgent(@RequestBody CreateAgentHttpRequest request, @RequestHeader(value = "X-LocalAgentId") String agentId) {

        return ResponseEntity.ok(agentUseCase.createAgent(request, agentId));

    }

    @PatchMapping("/pair")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UpdateHttpResponse> updateAgent(@RequestBody UpdateAgentHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(agentUseCase.updateAgent(request, httpServletRequest));

    }

    @GetMapping("/exist")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Boolean> existsAgent(HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(agentUseCase.existsAgentByUserId(httpServletRequest));

    }

    @GetMapping("/linked/status")
    public ResponseEntity<SseEmitter> getAgentConnectionStatus(@RequestHeader(value = "X-LocalAgentId") String localAgentId) {

        return ResponseEntity.ok(agentUseCase.getAgentConnectionStatus(localAgentId));

    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AgentListHttpResponse> getAgentList(HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(agentUseCase.getAgentList(httpServletRequest));

    }

}