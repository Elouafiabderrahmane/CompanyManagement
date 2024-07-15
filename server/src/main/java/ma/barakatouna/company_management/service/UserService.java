package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.UserDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;

import java.util.List;

public interface UserService {

    List<UserDTO> findAll();

    UserDTO get(Long id);

    Long create(UserDTO userDTO);

    void update(Long id, UserDTO userDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);
}
