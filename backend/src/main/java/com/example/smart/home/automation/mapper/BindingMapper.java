package com.example.smart.home.automation.mapper;

import com.example.smart.home.automation.entity.BindingEntity;
import com.example.smart.home.automation.model.BindingModel;

public class BindingMapper {

    public static BindingModel toModel(BindingEntity entity) {

        if (entity == null) {
            return null;
        }

        return BindingModel.builder()
                .localAgentId(entity.getAgentEntity().getAgentId())
                .uid(entity.getUid())
                .label(entity.getLabel())
                .version(entity.getVersion())
                .author(entity.getAuthor())
                .verifiedAuthor(entity.isVerifiedAuthor())
                .installed(entity.isInstalled())
                .compatible(entity.isCompatible())
                .build();

    }

    public static BindingEntity toEntity(BindingModel model) {

        if (model == null) {
            return null;
        }

        return BindingEntity.builder()
                .uid(model.getUid())
                .label(model.getLabel())
                .version(model.getVersion())
                .author(model.getAuthor())
                .verifiedAuthor(model.isVerifiedAuthor())
                .installed(model.isInstalled())
                .compatible(model.isCompatible())
                .build();

    }

}