package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.CreateRuleHttpRequest;
import com.example.smart.home.automation.api.dto.request.EnableRuleHttpRequest;
import com.example.smart.home.automation.api.dto.response.GetRuleListHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.useCase.RuleUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rule")
public class RuleController {

    private final RuleUseCase ruleUseCase;

    public RuleController(
            RuleUseCase ruleUseCase) {
        this.ruleUseCase = ruleUseCase;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TriggerHttpResponse> createRuleEvent(@Valid @RequestBody CreateRuleHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(ruleUseCase.createRuleEvent(request, httpServletRequest));

    }

    @PutMapping("/enable")
    public ResponseEntity<TriggerHttpResponse> enable(@RequestHeader("X-RuleUid") String ruleUID, @RequestBody EnableRuleHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(ruleUseCase.enableRuleEvent(ruleUID, request, httpServletRequest));

    }

    @DeleteMapping("/delete")
    public ResponseEntity<TriggerHttpResponse> delete(@RequestHeader("X-RuleUid") String ruleUID, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(ruleUseCase.deleteRuleEvent(ruleUID, httpServletRequest));

    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetRuleListHttpResponse> getRuleList() {

        return ResponseEntity.ok(ruleUseCase.getRuleList());

    }

}