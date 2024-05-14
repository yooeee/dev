package com.store.dev.web.api;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;
    
    @GetMapping("")
    public ResponseDTO searchList(@RequestParam SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        
        searchDTO.setCategory(null);
        searchDTO.setKeyword("");
        searchDTO.setPage(1);
        searchDTO.setType1(null);
        searchDTO.setType2(null);

        List<StoreDTO> list = storeService.selectListStore(searchDTO);
        res.setStatus("SUCCESS");
        res.setErrCode(null);
        res.setResult(list);
        return res;
    }
}
