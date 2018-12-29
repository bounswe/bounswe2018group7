package com.history;

public class Reaction {
    int id;
    int memory_post;
    String username;
    boolean like;

    public Reaction(int memory_post, boolean like){
        this.memory_post = memory_post;
        this.like = like;
    }
}
