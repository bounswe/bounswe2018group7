package com.history;

import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface ApiEndpoints {
    @POST("/api/v1/signup/")
    public Call<User> signUp(@Body User user);

    @POST("/api/v1/signin/")
    public Call<User> signIn(@Body User user);

    @POST("/api/v1/signout/")
    public Call<User> signOut(@Header("Authorization") String token);

    @POST("/api/v1/password_reset/")
    public Call<User> passwordReset(@Body User user);

    @GET("/api/v1/memory_posts/")
    public Call<MemoryPostPage> getMemoryPosts();

    @POST("/api/v1/memory_posts/")
    public Call<MemoryPost> createMemoryPost(@Header("Authorization") String token, @Body MemoryPost memoryPost);

    // previous code for multiple files
    @Multipart
    @POST("/api/v1/memory_posts/")
    Call<ResponseBody> uploadMultipleFiles(
            @Header("Authorization") String token,
            @Part("title") RequestBody title,
            @Part("time") RequestBody time,
            @Part("location") RequestBody location,
            @Part List<MultipartBody.Part> story);


}