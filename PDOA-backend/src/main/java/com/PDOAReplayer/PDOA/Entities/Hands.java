package com.PDOAReplayer.PDOA.Entities;

import org.springframework.cglib.core.GeneratorStrategy;

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

    public void setHandHistory(String handHistory) {
        this.handBoard = handHistory;
    }

    public String getHandHistory() {
        return handBoard;
    }
}
