package com.PDOAReplayer.PDOA.Controllers.payload;

import java.util.Set;

public class RegisterRequest {
    private String username;
    private String fullName;
    private String country;
    private String password;
    private String roles;

    public RegisterRequest() {
    }

    public RegisterRequest(String username, String fullName, String country, String password) {
        this.username = username;
        this.fullName = fullName;
        this.country = country;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String role) {
        this.roles = role;
    }
}
