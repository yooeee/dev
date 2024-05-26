package com.store.dev.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRadiusDTO {

    private double lon;
    private double lat;
    private int radius;
    private String keyword;
    private List<String> category;

}
