package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Entities.Hands;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.HandsRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hands")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HandsController {
    HandsRepository repository;

    public HandsController(HandsRepository repository) {
        this.repository = repository;
    }

    @PostMapping(path = "/upload")
    public Long UploadHand(@RequestBody String handHistory) {
        Hands newHand = new Hands();
        newHand.setHandHistory(handHistory);
        repository.saveAndFlush(newHand);
        return repository.getLast();
    }
}
