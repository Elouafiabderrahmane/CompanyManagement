package ma.barakatouna.company_management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;


@Configuration
@PropertySource("classpath:application.properties") // Optional if you still use other properties
public class JwtConfig {

    @Value("${JWT_SECRET_KEY}")
    private String secretKey;


    public String getSecretKey() {
        return secretKey;
    }
}
