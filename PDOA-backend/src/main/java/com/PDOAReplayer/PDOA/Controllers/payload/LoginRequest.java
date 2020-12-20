package com.PDOAReplayer.PDOA.Controllers.payload;

import com.sun.istack.NotNull;

public class LoginRequest {
    @NotNull
    private String username;

    @NotNull
    private String password;

    @NotNull
    private byte[] key;

    @NotNull
    private String initVector;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public byte[] getKey() { return key; }

    public void setKey(byte[] key) { this.key = key; }

    public String getInitVector() {
        return initVector;
    }

    public void setInitVector(String initVector) {
        this.initVector = initVector;
    }
}
