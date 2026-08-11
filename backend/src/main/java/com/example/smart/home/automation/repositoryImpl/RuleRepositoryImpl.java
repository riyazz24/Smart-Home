package com.example.smart.home.automation.repositoryImpl;

import com.example.smart.home.automation.dto.response.RuleListResponse;
import com.example.smart.home.automation.entity.RuleEntity;
import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.jpaRepository.RuleJpaRepository;
import com.example.smart.home.automation.mapper.RuleMapper;
import com.example.smart.home.automation.model.RuleModel;
import com.example.smart.home.automation.repository.RuleRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public class RuleRepositoryImpl implements RuleRepository {

    private final RuleJpaRepository ruleJpaRepository;

    public RuleRepositoryImpl(
            RuleJpaRepository ruleJpaRepository) {
        this.ruleJpaRepository = ruleJpaRepository;
    }

    @Override
    public void save(RuleModel model) {

        RuleEntity ruleEntity = RuleMapper.toEntity(model);

        ruleJpaRepository.save(ruleEntity);

    }

    @Override
    public void updateRuleByRuleUid(String ruleUid, String status) {

        int updated = ruleJpaRepository.updateRuleByRuleUID(ruleUid, status, Instant.now());

        if (updated == 0) {
            throw new NotFoundException("Rule not found");
        }

    }

    @Override
    public void deleteRuleByRuleUid(String ruleUid) {

        int deleted = ruleJpaRepository.deleteByRuleUID(ruleUid);

        if (deleted == 0) {
            throw new NotFoundException("Rule not found");
        }

    }

    @Override
    public boolean existsRuleByRuleName(String ruleName) {

        return ruleJpaRepository.existsByRuleName(ruleName);

    }

    @Override
    public List<RuleListResponse> findAllRules() {

        return ruleJpaRepository.findAll()
                .stream()
                .map(ruleEntity -> new RuleListResponse(
                        ruleEntity.getRuleUID(),
                        ruleEntity.getRuleName(),
                        ruleEntity.getStatus(),
                        ruleEntity.getTriggerJson(),
                        ruleEntity.getActionsJson())
                )
                .toList();

    }

}
