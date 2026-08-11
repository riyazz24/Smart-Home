package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.RuleEntity;
import com.example.smart.home.automation.model.RuleModel;

public class RuleMapper {

    public static RuleModel toModel(RuleEntity entity) {

        if (entity == null) {
            return null;
        }

        return RuleModel.builder()
                .ruleUID(entity.getRuleUID())
                .ruleName(entity.getRuleName())
                .status(entity.getStatus())
                .triggerJson(entity.getTriggerJson())
                .actionsJson(entity.getActionsJson())
                .build();

    }

    public static RuleEntity toEntity(RuleModel model) {

        if (model == null) {
            return null;
        }

        return RuleEntity.builder()
                .ruleUID(model.getRuleUID())
                .ruleName(model.getRuleName())
                .status(model.getStatus())
                .triggerJson(model.getTriggerJson())
                .actionsJson(model.getActionsJson())
                .build();

    }

}
