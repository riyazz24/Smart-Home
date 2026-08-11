package com.example.smart.home.automation.openhab.payload;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ThingResultPayload {

    private boolean status;

    private String message;

}