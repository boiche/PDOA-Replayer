package com.PDOAReplayer.PDOA.Entities;

import org.springframework.cglib.core.GeneratorStrategy;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "hands")
public class Hands {
    @Id @GeneratedValue
    private Long id;
    @Column
    private String handHistory;
    @Column
    private Date dateUploaded;

    public void setHandHistory(String handHistory) {
        this.handHistory = handHistory;
    }

    public void setDateUploaded(Date dateUploaded) {
        this.dateUploaded = dateUploaded;
    }

    public String getHandHistory() {
        return handHistory;
    }

    public Date getDateUploaded() {
        return dateUploaded;
    }
}
