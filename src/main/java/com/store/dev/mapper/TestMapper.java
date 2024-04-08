package com.store.dev.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TestMapper {

    String selectOneTest();
    
} 
