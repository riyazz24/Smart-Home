package com.example.smart.home.automation.openhab.payload;

import com.example.smart.home.automation.model.ThingItemsModel;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenhabAddThingPayload {

    private String localAgentId;

    private OpenhabEvent openhabEvent;

    private String thingUID;

    private String roomId;

    private String thingTypeUID;

    private String label;

    private Map<String, Object> configuration;

    private List<ThingItemsModel> thingItemsModelList;

}