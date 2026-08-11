package com.example.smart.home.automation.repository;

import com.example.smart.home.automation.model.BindingModel;

import java.util.List;

public interface BindingRepository {

    void save(BindingModel model);

    void deleteBindingByUid(String uid);

    boolean existsBindingByUid(String uid);

    List<BindingModel> findBindingList();

}