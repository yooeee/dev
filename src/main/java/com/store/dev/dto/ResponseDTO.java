package com.store.dev.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseDTO {

    private String status; // success, fail
    private String errCode; // 실패 코드
    private Object result; // 결과값

}
