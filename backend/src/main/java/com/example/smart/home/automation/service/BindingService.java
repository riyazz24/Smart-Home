package com.example.smart.home.automation.service;

import com.example.smart.home.automation.model.BindingModel;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BindingService {

    @Transactional
    void createBinding(BindingModel model);

    @Transactional
    void deleteBindingByUid(String uid);

    boolean existsBindingByUid(String uid);

    List<BindingModel> getBindingList();

}