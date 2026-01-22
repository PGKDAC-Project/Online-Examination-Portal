package com.oep;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication // @Configuration : bean config xml file
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean // <bean id class ...../>
	ModelMapper modelMapper() {
		System.out.println("creating n configuring model mapper");
		ModelMapper mapper = new ModelMapper();
		//1. set matching strategy - STRICT => Transfer only those props with matching names & data types
		mapper.getConfiguration()
		.setMatchingStrategy(MatchingStrategies.STRICT)
//		//2. DO not transfer null values from src->dest
		.setPropertyCondition(Conditions.isNotNull());		
		return mapper;
	}
	
	//configure passwd encoder as an spring bean
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	

}
