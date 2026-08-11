package com.example.smart.home.automation.openhab.payload;

import com.example.smart.home.automation.openhab.enums.OpenhabEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BindingPayload {

    private String localAgentId;

    private OpenhabEvent openhabEvent;

    private String uid;

    private String label;

    private String version;

    private String author;

    private boolean verifiedAuthor;

    private boolean installed;

    private boolean compatible;

}