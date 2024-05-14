package com.store.dev.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRadiusDTO {

    private double lon;
    private double lat;
    private int radius;

}
