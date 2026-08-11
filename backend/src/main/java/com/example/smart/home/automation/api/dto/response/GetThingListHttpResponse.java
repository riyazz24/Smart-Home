package com.example.smart.home.automation.api.dto.response;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetThingListHttpResponse {

	private List<ThingListResponse> thingList;

}
