package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.model.BindingModel;
import com.example.smart.home.automation.repository.BindingRepository;
import com.example.smart.home.automation.service.BindingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BindingServiceImpl implements BindingService {

    private final BindingRepository bindingRepository;

    public BindingServiceImpl(
            BindingRepository bindingRepository) {
        this.bindingRepository = bindingRepository;
    }

    @Override
    public void createBinding(BindingModel model) {

        bindingRepository.save(model);

    }

    @Override
    public void deleteBindingByUid(String uid) {

        bindingRepository.deleteBindingByUid(uid);

    }

    @Override
    public boolean existsBindingByUid(String uid) {

        return bindingRepository.existsBindingByUid(uid);

    }

    @Override
    public List<BindingModel> getBindingList() {

        return bindingRepository.findBindingList();

    }

}