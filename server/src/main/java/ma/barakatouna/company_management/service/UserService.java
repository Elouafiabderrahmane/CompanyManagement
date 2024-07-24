package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Role;
import ma.barakatouna.company_management.entities.User;
import ma.barakatouna.company_management.model.UserDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.RoleRepository;
import ma.barakatouna.company_management.repos.UserRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployerRepository employerRepository;

    public UserService(final UserRepository userRepository, final RoleRepository roleRepository,
            final EmployerRepository employerRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.employerRepository = employerRepository;
    }

    public List<UserDTO> findAll() {
        final List<User> users = userRepository.findAll(Sort.by("id"));
        return users.stream()
                .map(user -> mapToDTO(user, new UserDTO()))
                .toList();
    }

    public UserDTO get(final Long id) {
        return userRepository.findById(id)
                .map(user -> mapToDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final UserDTO userDTO) {
        final User user = new User();
        mapToEntity(userDTO, user);
        return userRepository.save(user).getId();
    }

    public void update(final Long id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(userDTO, user);
        userRepository.save(user);
    }

    public void delete(final Long id) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        roleRepository.findAllByUsers(user)
                .forEach(role -> role.getUsers().remove(user));
        userRepository.delete(user);
    }

    private UserDTO mapToDTO(final User user, final UserDTO userDTO) {
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setEmail(user.getEmail());
        userDTO.setEnabled(user.getEnabled());
        return userDTO;
    }

    private User mapToEntity(final UserDTO userDTO, final User user) {
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setEnabled(userDTO.getEnabled());
        return user;
    }

    public boolean usernameExists(final String username) {
        return userRepository.existsByUsernameIgnoreCase(username);
    }

    public boolean emailExists(final String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Employer userEmployer = employerRepository.findFirstByUser(user);
        if (userEmployer != null) {
            referencedWarning.setKey("user.employer.user.referenced");
            referencedWarning.addParam(userEmployer.getId());
            return referencedWarning;
        }
        return null;
    }
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User addNewUser(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) throw new RuntimeException("User already exists");

        // Ensure roles exist in the database
        Set<Role> userRoles = new HashSet<>();
        for (Role role : user.getRoles()) {
            Role existingRole = roleRepository.findByRole(role.getRole());
            if (existingRole == null) {
                existingRole = roleRepository.save(role);
            }
            userRoles.add(existingRole);
        }
        user.setRoles(userRoles);

        return userRepository.save(user);
    }
}
