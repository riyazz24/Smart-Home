package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateAgentHttpRequest {

    @NotBlank(message = "Agent name is required")
    private String agentName;

    @NotBlank(message = "Pairing code is required")
    private String pairingCode;

}