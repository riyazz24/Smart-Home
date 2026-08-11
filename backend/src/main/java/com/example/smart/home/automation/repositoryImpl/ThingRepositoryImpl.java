package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.api.dto.response.ThingItemsListResponse;
import com.example.smart.home.automation.api.dto.response.ThingListResponse;
import com.example.smart.home.automation.entity.RoomEntity;
import com.example.smart.home.automation.entity.ThingEntity;
import com.example.smart.home.automation.entity.ThingItemsEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.jpaRepository.RoomJpaRepository;
import com.example.smart.home.automation.jpaRepository.RuleJpaRepository;
import com.example.smart.home.automation.jpaRepository.ThingJpaRepository;
import com.example.smart.home.automation.mapper.ThingItemsMapper;
import com.example.smart.home.automation.mapper.ThingMapper;
import com.example.smart.home.automation.model.ThingModel;
import com.example.smart.home.automation.repository.ThingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ThingRepositoryImpl implements ThingRepository {

    private final RoomJpaRepository roomJpaRepository;
    private final ThingJpaRepository thingJpaRepository;
    private final RuleJpaRepository ruleJpaRepository;


    public ThingRepositoryImpl(
            RoomJpaRepository roomJpaRepository,
            ThingJpaRepository thingJpaRepository,
            RuleJpaRepository ruleJpaRepository) {
        this.roomJpaRepository = roomJpaRepository;
        this.thingJpaRepository = thingJpaRepository;
        this.ruleJpaRepository = ruleJpaRepository;
    }

    @Override
    public void save(ThingModel model) {

        RoomEntity roomEntity = roomJpaRepository.findByRoomId(model.getRoomId())
                .orElseThrow(() -> new NotFoundException("Room not found"));

        ThingEntity thingEntity = ThingMapper.toEntity(model);
        thingEntity.setRoomEntity(roomEntity);

        List<ThingItemsEntity> thingItemsEntityList = model.getThingItemsModelList()
                .stream()
                .map(ThingItemsMapper::toEntity)
                .toList();

        thingItemsEntityList.forEach(thingItemsEntity -> thingItemsEntity.setThingEntity(thingEntity));

        thingEntity.setThingItemsEntityList(thingItemsEntityList);

        thingJpaRepository.save(thingEntity);

    }

	@Override
	public List<ThingListResponse> findAllThingsByRoomIdAndAgentIdAndUserId(String agentId, String userId, String roomId) {

        List<ThingEntity> thingEntityList = (roomId == null || roomId.isBlank())
                ? thingJpaRepository.findAllByRoomEntity_AgentEntity_AgentIdAndRoomEntity_AgentEntity_UserEntity_UserId(agentId, userId)
                : thingJpaRepository.findAllByRoomEntity_RoomIdAndRoomEntity_AgentEntity_AgentIdAndRoomEntity_AgentEntity_UserEntity_UserId(roomId, agentId, userId);

        return thingEntityList
                .stream()
                .map(thingEntity -> new ThingListResponse(
                        thingEntity.getThingUID(),
                        thingEntity.getLabel(),
                        thingEntity.getRoomEntity().getRoomId(),
                        thingEntity.getRoomEntity().getRoomName(),
                        thingEntity.getThingItemsEntityList()
                                .stream()
                                .map(thingItemsEntity -> new ThingItemsListResponse(
                                        thingItemsEntity.getItemName(),
                                        thingItemsEntity.getChannelId())
                                )
                                .toList())
                )
                .toList();
	}

	@Override
	public void deleteThingAndAssociatedDataByThingUIDAndUserId(String thingUID, String userId) {

		// 1. Identify the device, scoped to the requesting user so a user can
		//    never delete a device that doesn't belong to them.
		ThingEntity thingEntity = thingJpaRepository
				.findByThingUIDAndRoomEntity_AgentEntity_UserEntity_UserId(thingUID, userId)
				.orElseThrow(() -> new NotFoundException("Device not found."));

		// 2. Delete any rules (modes/schedulers) that reference a channel of this device.
		//    NOTE: RuleEntity has no FK to ThingEntity in this schema, so this is a
		//    best-effort cleanup matched on the device's unique channel item names.
		thingEntity.getThingItemsEntityList()
				.stream()
				.map(ThingItemsEntity::getItemName)
				.forEach(ruleJpaRepository::deleteAllReferencingItemName);

		// 3. Delete the device itself. This cascades to ThingItemsEntity (channels)
		//    automatically, because ThingEntity#thingItemsEntityList is mapped with
		//    cascade = CascadeType.ALL, orphanRemoval = true — no manual code needed
		//    for that relationship, and it happens inside this same transaction.
		thingJpaRepository.delete(thingEntity);

	}

	@Override
	public void updateThingLabelByThingUIDAndUserId(String thingUID, String userId, String label) {
		
		ThingEntity thingEntity = thingJpaRepository
				.findByThingUIDAndRoomEntity_AgentEntity_UserEntity_UserId(thingUID, userId)
				.orElseThrow(() -> new NotFoundException("Device not found."));

		thingEntity.setLabel(label);

		thingJpaRepository.save(thingEntity);

	}
}
