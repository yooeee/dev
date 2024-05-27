package com.store.dev.web.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.SggDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/bjcd")
public class BjCdApiController {

    @Resource
    private StoreService storeService;
    
    @GetMapping("/sgg")
    public ResponseDTO selectListSggBySdBjcd(@RequestParam String bjcd) {
        ResponseDTO res = new ResponseDTO();
        
        List<SggDTO> list = storeService.selectListSggBySdBjcd(bjcd);

        res.setStatus("SUCCESS");
        res.setErrCode(null);
        res.setResult(list);
        return res;
    }
}
