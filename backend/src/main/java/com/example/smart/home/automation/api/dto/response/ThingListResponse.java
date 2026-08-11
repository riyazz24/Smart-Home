package com.example.smart.home.automation.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ThingListResponse {

	private String thingUID;
	
	private String label;
	
	private String roomId;
	
	private String roomName;
	
	private List<ThingItemsListResponse> thingItemsListResponseList;
}
