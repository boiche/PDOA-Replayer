package com.PDOAReplayer.PDOA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

public class HandsCredentials {
    private String owner;
    private String[] cards;
    private Date uploaded;
    private Long handId;

    public HandsCredentials(String owner, String[] cards, Date uploaded, Long handId) {
        this.owner = owner;
        this.cards = cards;
        this.uploaded = uploaded;
        this.handId = handId;
    }

    public String getOwner() {
        return owner;
    }

    public String[] getCards() {
        return cards;
    }

    public Date getUploaded() {
        return uploaded;
    }

    public Long getHandId() {
        return handId;
    }
}
