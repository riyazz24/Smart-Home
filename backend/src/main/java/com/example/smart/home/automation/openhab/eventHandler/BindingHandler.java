package com.example.smart.home.automation.openhab.eventHandler;

import com.example.smart.home.automation.exception.NotFoundException;
import com.example.smart.home.automation.model.BindingModel;
import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import com.example.smart.home.automation.openhab.payload.BindingPayload;
import com.example.smart.home.automation.service.BindingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BindingHandler {

    private final ObjectMapper objectMapper;
    private final BindingService bindingService;

    public BindingHandler(
            ObjectMapper objectMapper,
            BindingService bindingService) {
        this.objectMapper = objectMapper;
        this.bindingService = bindingService;
    }

    public void handle(String payload) {

        try {

            BindingPayload bindingPayload = objectMapper.readValue(payload, BindingPayload.class);

            OpenhabEvent openhabEvent = OpenhabEvent.valueOf(bindingPayload.getOpenhabEvent().name());

            switch (openhabEvent) {

                case BINDING_INSTALL -> {

                    if (!bindingService.existsBindingByUid(bindingPayload.getUid())) {

                        BindingModel model = BindingModel.builder()
                                .localAgentId(bindingPayload.getLocalAgentId())
                                .uid(bindingPayload.getUid())
                                .label(bindingPayload.getLabel())
                                .version(bindingPayload.getVersion())
                                .author(bindingPayload.getAuthor())
                                .verifiedAuthor(bindingPayload.isVerifiedAuthor())
                                .installed(bindingPayload.isInstalled())
                                .compatible(bindingPayload.isCompatible())
                                .build();

                        bindingService.createBinding(model);

                        log.info("\n \n BINDING CREATED - ADDON-ID: {} \n", bindingPayload.getUid());

                    }

                }

                case BINDING_UNINSTALL -> {

                    bindingService.deleteBindingByUid(bindingPayload.getUid());

                    log.info("\n \n BINDING DELETED - ADDON-ID: {} \n", bindingPayload.getUid());

                }

                default -> throw new NotFoundException("Event not found");

            }

        } catch (Exception e) {

            log.error("\n \n FAILED TO HANDLE BINDING  \n", e);

        }

    }

}