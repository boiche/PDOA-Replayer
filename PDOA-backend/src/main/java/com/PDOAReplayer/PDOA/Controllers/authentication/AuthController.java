package com.PDOAReplayer.PDOA.Controllers.authentication;

import com.PDOAReplayer.PDOA.Controllers.payload.JwtResponse;
import com.PDOAReplayer.PDOA.Controllers.payload.LoginRequest;
import com.PDOAReplayer.PDOA.Controllers.payload.MessageResponse;
import com.PDOAReplayer.PDOA.Controllers.payload.RegisterRequest;
import com.PDOAReplayer.PDOA.Entities.ERole;
import com.PDOAReplayer.PDOA.Entities.Role;
import com.PDOAReplayer.PDOA.Entities.Users;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.RolesRepository;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import com.PDOAReplayer.PDOA.security.jwt.JwtUtils;
import com.PDOAReplayer.PDOA.security.services.UserDetailsImpl;
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

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(role -> role.getAuthority()).collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
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
/*        else {
            stringRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role roleAdmin = rolesRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Role " + stringRoles + " is not found!"));
                        roles.add(roleAdmin);
                        break;
                    //add here any other roles
                    default:
                        Role roleUser = rolesRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Role " + stringRoles + " is not found!"));
                        roles.add(roleUser);
                }
            });
        }*/

        newUser.setRoles(roles);
        usersRepository.save(newUser);
        return ResponseEntity.ok(new MessageResponse("User " + newUser.getUsername() + " registered successfully."));
    }
}
