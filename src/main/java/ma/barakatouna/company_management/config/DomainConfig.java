package ma.barakatouna.company_management.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("ma.barakatouna.company_management.entities")
@EnableJpaRepositories("ma.barakatouna.company_management.repos")
@EnableTransactionManagement
public class DomainConfig {
}
