package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
}
