package com.example.smart.home.automation.api.dto.request;

import com.example.smart.home.automation.openhab.payload.OpenhabRulePayload;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CreateRuleHttpRequest {

    @NotBlank(message = "Rule name is required")
    private String ruleName;

    @Valid
    private OpenhabRulePayload.TriggerPayload triggerPayload;

    @NotEmpty(message = "At least one action is required")
    @Valid
    private List<OpenhabRulePayload.ActionPayload> actionPayloadList;

}