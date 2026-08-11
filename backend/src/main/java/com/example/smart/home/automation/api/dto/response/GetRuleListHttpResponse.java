package com.example.smart.home.automation.api.dto.response;

import com.example.smart.home.automation.dto.response.RuleListResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class GetRuleListHttpResponse {

    private List<RuleListResponse> ruleList;

}
