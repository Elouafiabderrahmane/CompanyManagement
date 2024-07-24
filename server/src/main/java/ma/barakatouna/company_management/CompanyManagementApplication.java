package ma.barakatouna.company_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class CompanyManagementApplication {

    public static void main(final String[] args) {
        SpringApplication.run(CompanyManagementApplication.class, args);
        System.out.println("CompanyManagement Running ........");
    }

}
