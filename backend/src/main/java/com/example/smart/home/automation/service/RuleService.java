package com.example.smart.home.automation.service;

import com.example.smart.home.automation.dto.response.RuleListResponse;
import com.example.smart.home.automation.model.RuleModel;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface RuleService {

    void createRule(RuleModel model);

    @Transactional
    void updateRuleByRuleUid(String ruleUid, String status);

    @Transactional
    void deleteRuleByRuleUid(String ruleUid);

    List<RuleListResponse> getRuleList();

}