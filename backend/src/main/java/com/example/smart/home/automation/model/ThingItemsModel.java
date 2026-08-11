package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThingItemsModel {

    private String itemName;

    private String channelId;

    private String channelUID;

    private String itemType;

}
