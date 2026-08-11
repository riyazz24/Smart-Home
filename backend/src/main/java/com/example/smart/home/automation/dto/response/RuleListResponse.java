package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RuleListResponse {

    private String ruleUid;

    private String ruleName;

    private String status;

    private String triggerJson;

    private String actionsJson;

}
