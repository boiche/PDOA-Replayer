package com.PDOAReplayer.PDOA.Controllers.payload.responses;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String countryCode;
    private List<String> roles;

    public JwtResponse(String token, Long id, String username, List<String> roles, String countryCode) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.countryCode = countryCode;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
