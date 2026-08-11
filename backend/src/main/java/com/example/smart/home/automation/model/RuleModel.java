package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class RuleModel {

    private String ruleUID;

    private String ruleName;

    private String status;

    private String triggerJson;

    private String actionsJson;

}
