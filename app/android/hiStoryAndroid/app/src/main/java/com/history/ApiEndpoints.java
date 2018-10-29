package com.history;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiEndpoints {
    @POST("/api/v1/signup/")
    public Call<User> signUp(@Body User user);

    @POST("/api/v1/signin/")
    public Call<User> signIn(@Body User user);

    @POST("/api/v1/password_reset/")
    public Call<User> passwordReset(@Body User user);

    @POST("/api/v1/memory_posts/")
    public Call<MemoryPost> createPost(@Body MemoryPost memoryPost);
}
