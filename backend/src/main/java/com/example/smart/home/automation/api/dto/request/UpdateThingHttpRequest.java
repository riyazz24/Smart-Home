package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateThingHttpRequest {

	@NotBlank(message = "This field is required")
	private String label;

}


