package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ThingModel {

    private String roomId;

    private String thingUid;

    private String thingTypeUid;

    private String label;

    private String ipAddress;

    private String macAddress;

    private List<ThingItemsModel> thingItemsModelList;

}