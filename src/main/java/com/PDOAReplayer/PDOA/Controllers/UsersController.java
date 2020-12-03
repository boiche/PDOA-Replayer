package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Repositories.UsersRepository;
import org.hibernate.cfg.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    UsersRepository usersRepository;

    @GetMapping("/users/{id}")
    public ResponseBody UserPage() {
        throw new NotYetImplementedException();
    }
}
