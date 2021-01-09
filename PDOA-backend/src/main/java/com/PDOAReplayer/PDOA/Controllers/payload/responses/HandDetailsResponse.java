package com.PDOAReplayer.PDOA.Controllers.payload.responses;

import com.PDOAReplayer.PDOA.Entities.Hands;

public class HandDetailsResponse {
    private Hands handHistory;
    private Integer seats;
    private String username;

    public Hands getHandHistory() {
        return handHistory;
    }

    public Integer getSeats() {
        return seats;
    }

    public String getUsername() {
        return username;
    }

    public HandDetailsResponse() {
    }

    public HandDetailsResponse(Hands handHistory, String username, Integer seats) {
        this.handHistory = handHistory;
        this.seats = seats;
        this.username = username;
    }
}
