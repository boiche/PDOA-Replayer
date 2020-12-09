package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Entities.Users;
import com.PDOAReplayer.PDOA.Repositories.UsersRepository;
import org.hibernate.cfg.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsersController {
    @Autowired
    UsersRepository usersRepository;

    @GetMapping("/all")
    public List<Users> AllUsers() {
        return usersRepository.findAll();
    }
}
