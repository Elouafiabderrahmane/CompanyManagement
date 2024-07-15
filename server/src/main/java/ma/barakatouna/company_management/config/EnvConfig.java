package ma.barakatouna.company_management.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    public EnvConfig() {
        Dotenv.configure().load();
    }
}
