package com.store.dev.service;

import java.util.List;

import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SggDTO;
import com.store.dev.dto.StoreDTO;

public interface StoreService {

    
    public List<StoreDTO> selectListStore(SearchDTO searchDTO);

    public int selectListStoreByCount(SearchDTO searchDTO);

    public List<SggDTO> selectListSggBySdBjcd(String bjcd);

    public List<StoreDTO> selectListStoreByDistance(SearchDTO searchDTO);

    public int selectListStoreCountByDistance(SearchDTO searchDTO);

} 