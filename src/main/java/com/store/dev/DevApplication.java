package com.store.dev;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.store.dev.mapper.StoreMapper;

import jakarta.annotation.Resource;

@SpringBootApplication
public class DevApplication {



	public static void main(String[] args) {
		SpringApplication.run(DevApplication.class, args);
	}

}
