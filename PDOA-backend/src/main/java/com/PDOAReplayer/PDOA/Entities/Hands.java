package com.PDOAReplayer.PDOA.Entities;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "hands")
public class Hands {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String handBoard;
    @Column
    private Long owner;
    @Column
    private Date uploaded;

    public void setHandHistory(String handHistory) {
        this.handBoard = handHistory;
    }

    public String getHandHistory() {
        return handBoard;
    }

    public Long getOwner() { return owner; }

    public void setOwner(Long ownerId) { this.owner = ownerId; }

    public Date getUploaded() {
        return uploaded;
    }

    public void setUploaded(Date uploaded) {
        this.uploaded = uploaded;
    }

    public Long getId() {
        return id;
    }
}
