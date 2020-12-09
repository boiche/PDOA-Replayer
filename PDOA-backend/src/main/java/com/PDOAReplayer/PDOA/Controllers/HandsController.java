package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Entities.Hands;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.HandsRepository;
import org.hibernate.cfg.NotYetImplementedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hands")
public class HandsController {
    HandsRepository repository;

    public HandsController(@RequestParam("handHistory") HandsRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/upload")
    public Hands UploadHand(String handHistory) {
        Hands newHand = new Hands();
        newHand.setHandHistory(handHistory);
        repository.addHand(newHand);
        //TODO: find a way how to insert record to DB and return new object with populated ID
        repository.saveAndFlush(newHand);
        throw new NotYetImplementedException();
    }
}
