package com.PDOAReplayer.PDOA.Controllers.authentication;

import com.PDOAReplayer.PDOA.Controllers.payload.responses.JwtResponse;
import com.PDOAReplayer.PDOA.Controllers.payload.requests.LoginRequest;
import com.PDOAReplayer.PDOA.Controllers.payload.responses.MessageResponse;
import com.PDOAReplayer.PDOA.Controllers.payload.requests.RegisterRequest;
import com.PDOAReplayer.PDOA.Entities.ERole;
import com.PDOAReplayer.PDOA.Entities.Role;
import com.PDOAReplayer.PDOA.Entities.Users;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.RolesRepository;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import com.PDOAReplayer.PDOA.security.jwt.JwtUtils;
import com.PDOAReplayer.PDOA.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(role -> role.getAuthority()).collect(Collectors.toList());
        if (userDetails.getAuthorities().stream().count() == 0) roles.add(ERole.ROLE_USER.toString());
        String countryCode = userDetails.getCountryCode();
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles, countryCode));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (usersRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Username is already taken!"));
        }

        Users newUser = new Users(request.getFullName(), request.getUsername(), passwordEncoder.encode(request.getPassword()), request.getCountry());
        String stringRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (stringRoles == null) {
            Role userRole = rolesRepository.findByName(ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Role " + stringRoles + " is not found!"));
            roles.add(userRole);
        }

        newUser.setRoles(roles);
        usersRepository.save(newUser);
        //TODO: set newUser's roleID: ROLE_USER if not specified
        return ResponseEntity.ok(new MessageResponse("User " + newUser.getUsername() + " registered successfully."));
    }
}
