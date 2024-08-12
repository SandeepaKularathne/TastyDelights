package lk.tastydelights;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;


@SpringBootApplication
@RestController // cant work on mapping which we implement without using this 
public class TastyDelightsApplication {


	public static void main(String[] args) {
		SpringApplication.run(TastyDelightsApplication.class, args);

		System.out.println("Tasty Delights");
	}

}     