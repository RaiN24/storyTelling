package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@SpringBootApplication
public class DemoApplication {
	@RequestMapping("/")
	public ModelAndView map(){
		ModelAndView mv=new ModelAndView("index");
		return mv;
	}
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
