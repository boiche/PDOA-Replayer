package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Entities.Users;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsersController {
    @Autowired
    UsersRepository usersRepository;
    Logger logger = LoggerFactory.getLogger(getClass());

    @GetMapping("/all")
    public List<Users> AllUsers() {
        return usersRepository.findAll();
    }

    @GetMapping("/user")
    public Users GetUser(@RequestParam String param, @RequestParam Boolean byUsername) {
        try {
            Users user;
            if (byUsername) {
                user = usersRepository.findByUsername(param).get();
            } else {
                user = usersRepository.findById(Long.parseLong(param)).get();
            }
            return user;
        } catch (Exception e) {
            logger.warn("No user was found with param: " + param);
            return null;
        }
    }
}
