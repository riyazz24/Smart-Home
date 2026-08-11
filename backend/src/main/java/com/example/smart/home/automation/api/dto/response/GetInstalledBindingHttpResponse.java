package com.example.smart.home.automation.api.dto.response;

import com.example.smart.home.automation.model.BindingModel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class GetInstalledBindingHttpResponse {

    private List<BindingModel> installedBindingList;

}