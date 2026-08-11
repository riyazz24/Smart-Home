package com.example.smart.home.automation.service;

import java.util.List;

import com.example.smart.home.automation.api.dto.response.ThingListResponse;
import com.example.smart.home.automation.model.ThingModel;

import jakarta.servlet.http.HttpServletRequest;

public interface ThingService {

    void createThing(ThingModel model);
    
	List<ThingListResponse> getAllThings(String agentId, String userId, String roomId);

	void deleteThingByThingUIDAndUserId(String thingUID, String userId);

	void updateThingLabel(String thingUID, String userId, String label);

}