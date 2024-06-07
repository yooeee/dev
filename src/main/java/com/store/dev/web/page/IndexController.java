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
    public ModelAndView getMethodName2(@RequestParam int seq, @RequestParam String category, @RequestParam String name, @RequestParam String doro, @RequestParam String jibeon) {
        ModelAndView mvn = new ModelAndView(("popup"));
        mvn.addObject("seq", seq);
        mvn.addObject("category", category);
        mvn.addObject("doro",doro);
        mvn.addObject("jibeon", jibeon);
        mvn.addObject("name", name);
        return mvn;
    }
    
}
