package com.example.smart.home.automation.api.controller;

import com.example.smart.home.automation.api.dto.request.CreateUserHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdatePasswordHttpRequest;
import com.example.smart.home.automation.api.dto.request.UpdateUserProfileHttpRequest;
import com.example.smart.home.automation.api.dto.response.CreateHttpResponse;
import com.example.smart.home.automation.api.dto.response.DeleteHttpResponse;
import com.example.smart.home.automation.api.dto.response.GetUserProfileHttpResponse;
import com.example.smart.home.automation.api.dto.response.UpdateHttpResponse;
import com.example.smart.home.automation.useCase.UserUseCase;
import com.example.smart.home.automation.util.Helper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserUseCase userUseCase;

    public UserController(
            UserUseCase userUseCase) {
        this.userUseCase = userUseCase;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateHttpResponse> createUser(@Valid @RequestBody CreateUserHttpRequest request) {

        return ResponseEntity.ok(userUseCase.createUser(request));

    }

    @PatchMapping("/profile/update")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<UpdateHttpResponse> updateUser(@Valid @RequestBody UpdateUserProfileHttpRequest request, HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(userUseCase.updateUser(request, httpServletRequest));

    }

    @PostMapping("/update/password")
    public ResponseEntity<UpdateHttpResponse> updatePassword(@Valid @RequestBody UpdatePasswordHttpRequest request, @CookieValue(value = "SECURITY_TOKEN_ID") String securityTokenId, @CookieValue(value = "SECURITY_TOKEN") String securityToken) {

        ResponseCookie securityTokenIdCookie = Helper.clearCookie("SECURITY_TOKEN_ID");
        ResponseCookie securityTokenCookie = Helper.clearCookie("SECURITY_TOKEN");

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, securityTokenIdCookie.toString())
                .header(HttpHeaders.SET_COOKIE, securityTokenCookie.toString())
                .body(userUseCase.updatePassword(request, securityTokenId, securityToken));

    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeleteHttpResponse> deleteUser(@RequestHeader("X-UserId") String userId) {

        return ResponseEntity.ok(userUseCase.delete(userId));

    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<GetUserProfileHttpResponse> getUser(HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(userUseCase.getUser(httpServletRequest));

    }

}