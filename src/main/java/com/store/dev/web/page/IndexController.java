package com.store.dev.web.page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;



@Controller
@RequestMapping("/index")
public class IndexController {
    
    @GetMapping("")
    public ModelAndView getMethodName() {
        ModelAndView mvn = new ModelAndView(("index"));
        return mvn;
    }

    @GetMapping("/info")
    public ModelAndView getMethodName2(@RequestParam int seq, @RequestParam String category, @RequestParam String name, @RequestParam String doro) {
        ModelAndView mvn = new ModelAndView(("popup"));
        return mvn;
    }
    
}
