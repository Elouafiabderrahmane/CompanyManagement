package ma.barakatouna.company_management.config;

import ma.barakatouna.company_management.entities.User;
import ma.barakatouna.company_management.repos.RoleRepository;
import ma.barakatouna.company_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Autowired
    public UserDetailServiceImpl(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User %s not found", username));
        }
        String[] roles = user.getRoles().stream().map(u->u.getRole()).toArray(String[]::new);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(roles)
                .build();
        return userDetails;

    }
}
