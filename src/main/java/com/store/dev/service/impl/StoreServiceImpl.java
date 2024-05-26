package com.store.dev.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.mapper.StoreMapper;
import com.store.dev.service.StoreService;

import jakarta.annotation.Resource;

@Service("StoreService")
public class StoreServiceImpl implements StoreService {

    @Resource
    private StoreMapper storeMapper;

    @Override
    public List<StoreDTO> selectListStore(SearchDTO searchDTO) {
       return storeMapper.selectListStore(searchDTO); 
    }

  
    
}
