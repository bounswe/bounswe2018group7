package com.history;

import org.w3c.dom.Comment;

import java.util.ArrayList;
import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

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
    public Call<MemoryPostPage> getMemoryPostsGuest();

    @GET("/api/v1/memory_posts/")
    public Call<MemoryPostPage> getMemoryPostsUser(@Header("Authorization") String token);

    @GET("/api/v1/memory_posts/{memoryPostId}/")
    public Call<MemoryPost> getMemoryPost(@Header("Authorization") String token, @Path("memoryPostId") String memoryPostId);


    @GET("/api/v1/comments/{memoryPostId}/")
    public Call<ArrayList<com.history.Comment>> getCommentsForMemoryPost(@Header("Authorization") String token, @Path("memoryPostId") String memoryPostId);

    @POST("/api/v1/comments")
    public Call<com.history.Comment> createComment(@Header("Authorization") String token, @Body com.history.Comment comment);

    @DELETE("/api/v1/comments/{id}/")
    public Call<Object> deleteComment(@Header("Authorization") String token, @Path("id") int id);


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
