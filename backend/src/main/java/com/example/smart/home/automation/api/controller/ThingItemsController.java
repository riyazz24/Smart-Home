package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.ControlThingHttpRequest;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.useCase.ThingItemsUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/thing/items")
public class ThingItemsController {

    private final ThingItemsUseCase thingItemsUseCase;

    public ThingItemsController(
            ThingItemsUseCase thingItemsUseCase) {
        this.thingItemsUseCase = thingItemsUseCase;
    }

    @PostMapping("/control")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TriggerHttpResponse> thingControlEvent(@RequestHeader("X-ThingUid") String thingUid, @RequestHeader("X-ChannelId") String channelId, @Valid @RequestBody ControlThingHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingItemsUseCase.thingControlEvent(thingUid, channelId, request, httpServletRequest));

    }

}