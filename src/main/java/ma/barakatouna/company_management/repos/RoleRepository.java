package ma.barakatouna.company_management.repos;

import java.util.List;
import ma.barakatouna.company_management.entities.Role;
import ma.barakatouna.company_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findFirstByUsers(User user);

    List<Role> findAllByUsers(User user);

    List<Role> findAllById( long userId);
    Role findByRole(String roleName);
}
