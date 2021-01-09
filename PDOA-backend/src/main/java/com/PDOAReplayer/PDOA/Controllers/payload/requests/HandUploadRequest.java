package com.PDOAReplayer.PDOA.Controllers.payload.requests;

public class HandUploadRequest {
    private String hand;
    private String username;

    public String getHand() {
        return hand;
    }

    public void setHand(String handHistory) {
        this.hand = handHistory;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
