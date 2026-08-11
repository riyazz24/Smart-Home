package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateRuleHttpRequest {

    @NotBlank(message = "This field is required")
    private String ruleName;

    private boolean enabled;

    @NotBlank(message = "This field is required")
    private String triggerJson;

    @NotBlank(message = "This field is required")
    private String actionsJson;

}
