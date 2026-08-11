package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.CreateThingHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateThingHttpRequest;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetThingListHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.useCase.ThingsUseCase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/thing")
public class ThingController {

    private final ThingsUseCase thingsUseCase;

    public ThingController(
            ThingsUseCase thingsUseCase) {
        this.thingsUseCase = thingsUseCase;
    }

    @PostMapping("/scan")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TriggerHttpResponse> thingScanEvent(@RequestHeader("X-Binding") String binding, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingsUseCase.thingScanEvent(binding, httpServletRequest));

    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TriggerHttpResponse> thingCreateEvent(@RequestBody CreateThingHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingsUseCase.thingCreateEvent(request, httpServletRequest));

    }
    
    @GetMapping("/list")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GetThingListHttpResponse> getThingList(@RequestHeader(value = "X-AgentId") String agentId, @RequestParam(value = "roomId", required = false) String roomId,  HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingsUseCase.getThingList(agentId, roomId, httpServletRequest));
    }
    
    @DeleteMapping("/{thingId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DeleteHttpResponse> deleteThing(@PathVariable("thingId") String thingId, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingsUseCase.deleteThing(thingId, httpServletRequest));

    }

    @PatchMapping("/{thingId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TriggerHttpResponse> updateThing(@PathVariable("thingId") String thingId, @Valid @RequestBody UpdateThingHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(thingsUseCase.updateThing(thingId, request, httpServletRequest));

    }
    
}