package com.store.dev.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SggDTO;
import com.store.dev.dto.StoreDTO;

@Mapper
public interface StoreMapper {

    List<StoreDTO> selectListStore(SearchDTO searchDTO);
    // int selectOneStoreListCount(SearchDTO searchDTO);

    List<SggDTO> selectListSggBySdBjcd(String bjcd);
    
} 
