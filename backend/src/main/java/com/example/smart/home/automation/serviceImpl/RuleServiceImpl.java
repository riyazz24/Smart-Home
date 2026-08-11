package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.dto.response.RuleListResponse;
import com.example.smart.home.automation.exception.ConflictException;
import com.example.smart.home.automation.model.RuleModel;
import com.example.smart.home.automation.repository.RuleRepository;
import com.example.smart.home.automation.service.RuleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuleServiceImpl implements RuleService {

    private final RuleRepository ruleRepository;

    public RuleServiceImpl(
            RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    @Override
    public void createRule(RuleModel model) {

        if (ruleRepository.existsRuleByRuleName(model.getRuleName())) {
            throw new ConflictException("Rule name already exists");
        }

        RuleModel ruleModel = RuleModel.builder()
                .ruleUID(model.getRuleUID())
                .ruleName(model.getRuleName())
                .status(model.getStatus())
                .triggerJson(model.getTriggerJson())
                .actionsJson(model.getActionsJson())
                .build();

        ruleRepository.save(ruleModel);

    }

    @Override
    public void updateRuleByRuleUid(String ruleUid, String status) {

        ruleRepository.updateRuleByRuleUid(ruleUid, status);

    }

    @Override
    public void deleteRuleByRuleUid(String ruleUid) {

        ruleRepository.deleteRuleByRuleUid(ruleUid);

    }

    @Override
    public List<RuleListResponse> getRuleList() {

        return ruleRepository.findAllRules();

    }

}
