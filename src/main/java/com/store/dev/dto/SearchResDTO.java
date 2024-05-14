package com.store.dev.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchResDTO {
    private List<StoreDTO> list;
    private int count;
}
