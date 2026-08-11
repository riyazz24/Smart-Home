package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.dto.response.RuleListResponse;
import com.example.smart.home.automation.model.RuleModel;

import java.util.List;

public interface RuleRepository {

    void save(RuleModel model);

    void updateRuleByRuleUid(String ruleUid, String status);

    void deleteRuleByRuleUid(String ruleUid);

    boolean existsRuleByRuleName(String ruleName);

    List<RuleListResponse> findAllRules();

}