package com.store.dev.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchDtDTO {
    private int page;
    private int maxIndex;
    private String keyword;
    private double lon;
    private double lat;
    private String type2;
    private List<String> category;
}
