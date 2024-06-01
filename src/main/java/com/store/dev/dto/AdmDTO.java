package com.store.dev.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdmDTO {
    
    private String code;
    private String name;
    private double lon;
    private double lat;
    private String geom; // 실제로는 geometry 타입, 문자열로 가정
    private int count;
}
