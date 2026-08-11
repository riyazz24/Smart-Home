package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.entity.BindingEntity;
import com.example.smart.home.automation.entity.AgentEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.jpaRepository.BindingJpaRepository;
import com.example.smart.home.automation.jpaRepository.AgentJpaRepository;
import com.example.smart.home.automation.mapper.BindingMapper;
import com.example.smart.home.automation.model.BindingModel;
import com.example.smart.home.automation.repository.BindingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BindingRepositoryImpl implements BindingRepository {

    private final AgentJpaRepository agentJpaRepository;
    private final BindingJpaRepository bindingJpaRepository;

    public BindingRepositoryImpl(
            AgentJpaRepository agentJpaRepository,
            BindingJpaRepository bindingJpaRepository) {
        this.agentJpaRepository = agentJpaRepository;
        this.bindingJpaRepository = bindingJpaRepository;
    }

    @Override
    public void save(BindingModel model) {

        AgentEntity agentEntity = agentJpaRepository.findByLocalAgentId(model.getLocalAgentId())
                .orElseThrow(() -> new NotFoundException("Agent not found"));

        BindingEntity bindingEntity = BindingMapper.toEntity(model);
        bindingEntity.setAgentEntity(agentEntity);

        bindingJpaRepository.save(bindingEntity);

    }

    @Override
    public void deleteBindingByUid(String uid) {

        bindingJpaRepository.deleteByUid(uid);

    }

    @Override
    public boolean existsBindingByUid(String uid) {

        return bindingJpaRepository.existsByUid(uid);

    }

    @Override
    public List<BindingModel> findBindingList() {

        return bindingJpaRepository.findAll()
                .stream()
                .map(BindingMapper::toModel)
                .toList();

    }

}