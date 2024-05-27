package com.store.dev.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SdDTO {
    
    private int gid;
    private String ufid;
    private String bjcd;
    private String name;
    private double lon;
    private double lat;
    private double geom;
}
