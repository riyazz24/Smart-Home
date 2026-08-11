package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.api.dto.response.ThingListResponse;
import com.example.smart.home.automation.model.ThingModel;
import com.example.smart.home.automation.repository.ThingRepository;
import com.example.smart.home.automation.service.ThingService;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ThingServiceImpl implements ThingService {

    private final ThingRepository thingRepository;

    public ThingServiceImpl(
            ThingRepository thingRepository) {
        this.thingRepository = thingRepository;
    }

    @Override
    public void createThing(ThingModel model) {

        ThingModel thingModel = ThingModel.builder()
                .roomId(model.getRoomId())
                .thingUid(model.getThingUid())
                .thingTypeUid(model.getThingTypeUid())
                .label(model.getLabel())
                .ipAddress(model.getIpAddress())
                .macAddress(model.getMacAddress())
                .thingItemsModelList(model.getThingItemsModelList())
                .build();

        thingRepository.save(thingModel);

    }

	@Override
	public List<ThingListResponse> getAllThings(String agentId, String userId, String roomId) {
		
		return thingRepository.findAllThingsByRoomIdAndAgentIdAndUserId(agentId, userId, roomId);

	}

	@Override
	public void deleteThingByThingUIDAndUserId(String thingUID, String userId) {

		thingRepository.deleteThingAndAssociatedDataByThingUIDAndUserId(thingUID, userId);

	}
	
	@Override
	public void updateThingLabel(String thingUID, String userId, String label) {

		thingRepository.updateThingLabelByThingUIDAndUserId(thingUID, userId, label);

	}
}