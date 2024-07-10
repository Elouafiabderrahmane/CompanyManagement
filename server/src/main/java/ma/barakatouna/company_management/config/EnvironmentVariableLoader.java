package ma.barakatouna.company_management.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class EnvironmentVariableLoader {
    @Autowired
    private Dotenv dotenv;

    @PostConstruct
    public void init() {
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
