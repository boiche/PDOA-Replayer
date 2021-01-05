package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Controllers.payload.HandUploadRequest;
import com.PDOAReplayer.PDOA.Entities.Hands;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.HandsRepository;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/hands")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HandsController {
    HandsRepository repository;
    UsersRepository usersRepository;

    public HandsController(HandsRepository repository, UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
        this.repository = repository;
    }

    @PostMapping(path = "/upload")
    public Hands UploadHand(@RequestBody HandUploadRequest request) {
        Calendar calendar = Calendar.getInstance();
        Hands newHand = new Hands();
        Long userId = usersRepository.findByUsername(request.getUsername()).get().getId();

        newHand.setOwner(userId);
        newHand.setHandHistory(request.getHand());
        newHand.setUploaded(calendar.getTime());

        return repository.save(newHand);
    }

    @GetMapping(path = "/all")
    public List<Hands> GetAllHands() {
        return repository.findAll();
    }
}
