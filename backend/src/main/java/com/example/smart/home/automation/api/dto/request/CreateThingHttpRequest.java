package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateThingHttpRequest {

    @NotBlank(message = "This field is required")
    private String roomId;

    @NotBlank(message = "This field is required")
    private String thingTypeUid;

    @NotBlank(message = "This field is required")
    private String label;

    @NotBlank(message = "This field is required")
    private String ipAddress;

    @NotBlank(message = "This field is required")
    private String macAddress;

}