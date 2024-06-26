package com.store.dev.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.store.dev.dto.AdmDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SggDTO;
import com.store.dev.dto.StoreDTO;

@Mapper
public interface StoreMapper {

    List<StoreDTO> selectListStore(SearchDTO searchDTO);

    int selectListStoreByCount(SearchDTO searchDTO);



    List<SggDTO> selectListSggBySdBjcd(String bjcd);

    List<StoreDTO> selectListStoreByDistance(SearchDTO searchDTO);

    int selectListStoreCountByDistance(SearchDTO searchDTO);


    // 클러스터링 sg, sdd
    List<AdmDTO> selectListSdCluster(SearchDTO searchDTO);
    List<AdmDTO> selectListSggCluster(SearchDTO searchDTO);
    

    
} 
