package com.PDOAReplayer.PDOA.Entities;

import java.util.Date;

public class HandsCredentials {
    private String owner;
    private String[] cards;
    private Date uploaded;

    public HandsCredentials(String owner, String[] cards, Date uploaded) {
        this.owner = owner;
        this.cards = cards;
        this.uploaded = uploaded;
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
}
