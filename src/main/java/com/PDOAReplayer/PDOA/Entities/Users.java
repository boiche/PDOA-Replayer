package com.PDOAReplayer.PDOA.Entities;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class Users {
    @Id @GeneratedValue
    private Long Id;

    @Column
    private String username;
}
