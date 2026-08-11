package com.example.smart.home.automation.repository;

import java.util.List;

import com.example.smart.home.automation.api.dto.response.ThingListResponse;
import com.example.smart.home.automation.model.ThingModel;

public interface ThingRepository {

    void save(ThingModel model);

	List<ThingListResponse> findAllThingsByRoomIdAndAgentIdAndUserId(String agentId, String userId, String roomId);

	/**
	 * Deletes the device identified by thingUID (scoped to the owning user), along with
	 * all data associated with it (channels, and any rules/schedulers referencing its channels).
	 * Throws NotFoundException if no such device exists for this user.
	 */
	void deleteThingAndAssociatedDataByThingUIDAndUserId(String thingUID, String userId);

	void updateThingLabelByThingUIDAndUserId(String thingUID, String userId, String label);
}                 