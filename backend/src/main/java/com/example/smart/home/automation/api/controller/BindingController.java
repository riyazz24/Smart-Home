package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.response.GetInstalledBindingHttpResponse;
import com.example.smart.home.automation.api.dto.response.TriggerHttpResponse;
import com.example.smart.home.automation.useCase.BindingUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/binding")
public class BindingController {

    private final BindingUseCase bindingUseCase;

    public BindingController(
            BindingUseCase bindingUseCase) {
        this.bindingUseCase = bindingUseCase;
    }

    @PostMapping("/install")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TriggerHttpResponse> installBindingEvent(@RequestHeader(value = "X-AddonId") String addonId) {

        return ResponseEntity.ok(bindingUseCase.installBindingEvent(addonId));

    }

    @PostMapping("/uninstall")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TriggerHttpResponse> uninstallBindingEvent(@RequestHeader(value = "X-AddonId") String addonId) {

        return ResponseEntity.ok(bindingUseCase.uninstallBindingEvent(addonId));

    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GetInstalledBindingHttpResponse> getBindingList() {

        return ResponseEntity.ok(bindingUseCase.getBindingList());

    }

}