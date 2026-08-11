package com.example.smart.home.automation.openhab.payload;

import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenhabInboxPayload {

    private String localAgentId;

    private OpenhabEvent openhabEvent;

    private String thingUID;

    private String thingTypeUID;

    private String label;

    private String bridgeUID;

    private Map<String, String> properties;

    private String representationProperty;

}