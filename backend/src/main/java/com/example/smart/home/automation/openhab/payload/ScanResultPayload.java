package com.example.smart.home.automation.openhab.payload;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class ScanResultPayload {

    private String thingUid;

    private String thingTypeUid;

    private String label;

    private String bridgeUid;

    private Map<String, String> properties;

    private String representationProperty;

}