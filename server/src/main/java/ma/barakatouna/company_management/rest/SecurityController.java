package ma.barakatouna.company_management.rest;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Role;
import ma.barakatouna.company_management.entities.User;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.service.EmployerService;
import ma.barakatouna.company_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class SecurityController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtEncoder jwtEncoder;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmployerRepository employerRepository;
    @GetMapping("/profile")
    public Authentication authentication(Authentication authentication) {
        return authentication;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        Instant instant = Instant.now();
        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(instant)
                .expiresAt(instant.plus(10, ChronoUnit.MINUTES))
                .subject(username)
                .claim("scope", scope)
                .build();

        // Change this line to use HS256
        JwtEncoderParameters jwtEncoderParameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), jwtClaimsSet);
        String jwt = jwtEncoder.encode(jwtEncoderParameters).getTokenValue();

        return Map.of("access-token", jwt);
    }


    @PostMapping("/register")
    public Map<String, String> register(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam Set<String> roles,
            @RequestParam String employerName,
            @RequestParam String employerPhone,
            @RequestParam String employerCin,
            @RequestParam String employerAddress,
            @RequestParam LocalDate employerHireDate,
            @RequestParam LocalDate employerBirthDate,
            @RequestParam String employerUrl) {

        // Create User
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true); // Assuming new users are enabled by default
        // Set Roles
        Set<Role> roleSet = new HashSet<>();
        for (String roleName : roles) {
            Role role = new Role();
            role.setRole(roleName);
            roleSet.add(role);
        }
        user.setRoles(roleSet);

        // Save User
        userService.addNewUser(user);

        // Create Employer
        Employer employer = new Employer();
        employer.setName(employerName);
        employer.setPhone(employerPhone);
        employer.setCin(employerCin);
        employer.setEmail(email); // Assuming email is the same as user email
        employer.setAdress(employerAddress);
        employer.setHireDate(employerHireDate);
        employer.setBirthDate(employerBirthDate);
        employer.setUrl(employerUrl);

        // Link Employer to User
        employer.setUser(user);

        // Save Employer
        employerRepository.save(employer);

        return Map.of("message", "User and Employer registered successfully");
    }

}
