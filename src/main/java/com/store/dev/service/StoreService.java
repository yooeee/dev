package com.store.dev.service;

import java.util.List;

import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.StoreDTO;

public interface StoreService {

    public List<StoreDTO> selectListStore(SearchDTO searchDTO);
    public int selectOneStoreListCount(SearchDTO searchDTO);
} 