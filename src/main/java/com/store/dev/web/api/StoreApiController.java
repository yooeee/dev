package com.store.dev.web.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;
    
    @GetMapping("")
    public ResponseDTO searchList(SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        SearchResDTO resDTO = new SearchResDTO();
        
        List<StoreDTO> list = storeService.selectListStore(searchDTO);
        int count = storeService.selectListStoreByCount(searchDTO);
        resDTO.setList(list);
        resDTO.setCount(count);
        
        res.setStatus("success");
        res.setErrCode(null);
        res.setResult(list);
        res.setResultCnt(count);
        return res;
    }
}
