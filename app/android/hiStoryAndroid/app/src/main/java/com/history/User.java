package com.history;

public class User {
    String username;
    String email;
    String password;
    String password_confirmation;
    String first_name;
    String last_name;
    String identity;
    boolean admin;
    boolean confirmed;
    boolean banned;
    String auth_token;

    public User(String username, String email, String password, String password_confirmation , String first_name, String last_name){
        this.username = username;
        this.email = email;
        this.password = password;
        this.password_confirmation = password_confirmation;
        this.first_name = first_name;
        this.last_name = last_name;
    }
    public User(String identity, String password){
        this.identity = identity;
        this.password = password;
    }
    public User(String email){
        this.email = email;
    }
}
