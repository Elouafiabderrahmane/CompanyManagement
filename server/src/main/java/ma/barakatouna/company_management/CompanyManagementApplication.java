package ma.barakatouna.company_management;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class CompanyManagementApplication {

    private static final Logger logger = LoggerFactory.getLogger(CompanyManagementApplication.class);
    public static void main(String[] args) {
        SpringApplication.run(CompanyManagementApplication.class, args);
        System.out.println("Application started successfully");
    }
}
