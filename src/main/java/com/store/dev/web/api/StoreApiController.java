package com.store.dev.web.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/store")
public class StoreApiController {
    

    @GetMapping("")
    public ModelAndView searchList() {
        ModelAndView mvn = new ModelAndView(("index"));
        return mvn;
    }
}
