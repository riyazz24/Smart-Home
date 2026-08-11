package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class BindingModel {

    private String localAgentId;

    private String uid;

    private String label;

    private String version;

    private String author;

    private boolean verifiedAuthor;

    private boolean installed;

    private boolean compatible;

}