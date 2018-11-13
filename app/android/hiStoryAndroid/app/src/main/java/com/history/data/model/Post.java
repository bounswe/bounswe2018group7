package com.history.data.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Post {

    @SerializedName("title")
    @Expose
    private String title;

    @SerializedName("time")
    @Expose
    private String time;

    @SerializedName("location")
    @Expose
    private String location;

    @SerializedName("story")
    @Expose
    private String[] story;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String[] getStory() {
        return story;
    }

    public void setStory(String[] story) {
        this.story = story;
    }

    @Override
    public String toString() {
        return "{" +
                "title='" + title + '\'' +
                ", time='" + time + '\'' +
                ", location=" + location +
                ", id=" + story +
                '}';
    }
}
