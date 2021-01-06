package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Controllers.payload.HandUploadRequest;
import com.PDOAReplayer.PDOA.Entities.Hands;
import com.PDOAReplayer.PDOA.Entities.HandsCredentials;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.HandsRepository;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.StyleContext;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/hands")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HandsController {
    HandsRepository repository;
    UsersRepository usersRepository;
    Logger logger = LoggerFactory.getLogger(this.getClass());

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
    public List<HandsCredentials> GetAllHands() {
        List<Hands> allHands = repository.findAll();
        List<HandsCredentials> credentials = new ArrayList<>();
        for (Hands currentHand : allHands) {
            credentials.add(new HandsCredentials(
                    usersRepository.findById(currentHand.getOwner()).get().getUsername(),
                    GetCards(currentHand.getHandHistory()),
                    currentHand.getUploaded()));
        }

        return credentials;
    }

    private String[] GetCards(String input) {
        Pattern cardPattern = Pattern.compile("([2-9]|[TQJKA])[schd]", Pattern.MULTILINE);
        String[] cards = new String[2];
        Integer matches = 0;
        Matcher matcher = cardPattern.matcher(input);

        while(matches < 2 && matcher.find()) {
            cards[matches] = matcher.group();
            matches++;
        }

        return cards;
    }
}
