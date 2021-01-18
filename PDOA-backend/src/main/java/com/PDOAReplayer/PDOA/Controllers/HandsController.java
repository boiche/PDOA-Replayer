package com.PDOAReplayer.PDOA.Controllers;

import com.PDOAReplayer.PDOA.Controllers.payload.requests.GetHandRequest;
import com.PDOAReplayer.PDOA.Controllers.payload.requests.HandUploadRequest;
import com.PDOAReplayer.PDOA.Controllers.payload.responses.HandDetailsResponse;
import com.PDOAReplayer.PDOA.Entities.Hands;
import com.PDOAReplayer.PDOA.Entities.HandsCredentials;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.HandsRepository;
import com.PDOAReplayer.PDOA.Repositories.Interfaces.UsersRepository;
import org.apache.coyote.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

        return repository.saveAndFlush(newHand);
    }

    @GetMapping(path = "/all")
    public List<HandsCredentials> GetAllHands() {
        List<Hands> allHands = repository.findAll();
        List<HandsCredentials> credentials = new ArrayList<>();
        for (Hands currentHand : allHands) {
            credentials.add(new HandsCredentials(
                    usersRepository.findById(currentHand.getOwner()).get().getUsername(),
                    GetCards(currentHand.getHandHistory()),
                    currentHand.getUploaded(),
                    currentHand.getId()));
        }

        return credentials;
    }

    @PostMapping(path = "/getHand")
    public ResponseEntity<?> GetHand(@RequestBody GetHandRequest request) {
        Hands result = repository.findById(Long.parseLong(request.getId())).get();
        String user = usersRepository.findById(result.getOwner()).get().getUsername();
        return ResponseEntity.ok(new HandDetailsResponse(result, user, getSeats(result.getHandHistory())));
    }

    private String[] GetCards(String input) {
        Pattern cardPattern = Pattern.compile("Dealt to .+ \\[.+\\]", Pattern.MULTILINE);
        String[] cards = new String[2];
        Matcher matcher = cardPattern.matcher(input);
        if (matcher.find()) {
            String match = matcher.group();
            match = match.substring(match.indexOf('[') + 1 , match.indexOf(']'));
            cards = match.split(" ");

        } else {
            for (int i = 0; i < cards.length; i++) {
                cards[i] = "2B";
            }
        }

        return cards;
    }

    private Integer getSeats(String hand) {
        Integer seats = 0;
        Pattern seatPattern = Pattern.compile("Seat");
        Matcher seatMatcher = seatPattern.matcher(hand);
        while(seatMatcher.find()) seats++;
        return seats / 2;
    }
}
