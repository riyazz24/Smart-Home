package com.example.smart.home.automation.openhab.payload;

import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenhabControlThingPayload {

    private String localAgentId;

    private OpenhabEvent openhabEvent;

    private String thingUID;

    private String itemName;

    private String channelId;

    private String command;

    private boolean status;

}