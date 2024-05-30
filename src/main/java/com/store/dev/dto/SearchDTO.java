package com.store.dev.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchDTO {
    private int page;
    private int maxIndex;
    private String keyword;
    private String type1;
    private String type2;
    private List<String> category;
    private double lon;
    private double lat;
    
}
