package com.history;

public class MemoryPost {
    String title;
    String time;
    String location;

    // Simple example only containing a title & story.
    String[] story;

    /*
    Actually it should be like this:

    Request Parameters:
    {
        'title': <a String of Memory-Title>,
        'time': <a JSON-Array (plain or as a String), elements of which represent Memory-Time items>,
        'location': <A JSON-Array (plain or as a String), elements of which represent Memory-Location items>,
        'story[0]': <a String or File which is a part of Memory-Story>,
        'story[1]': <a String or File which is a part of Memory-Story>,
        'story[<index>]': <a String or File which is a part of Memory-Story>,
        ...
     }
     */

    public MemoryPost(String title, String time, String location, String[] story){
        this.title = title;
        this.time = time;
        this.location = location;
        this.story = story;
    }

    public MemoryPost(String title, String[] story){
        this.title = title;
        this.story = story;
    }
}
