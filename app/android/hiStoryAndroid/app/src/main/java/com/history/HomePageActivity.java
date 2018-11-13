package com.history;

import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HomePageActivity extends AppCompatActivity {
    String SERVER_URL = "https://history-backend.herokuapp.com";
    boolean waitingResponse = false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_page);
        getMemoryPosts();
    }

    public void getMemoryPosts(){


        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

       /* MemoryPost memoryPost = new MemoryPost();
        memoryPost.title = "The Maiden's tower";
        memoryPost.time = new MemoryPostTime[1];
        memoryPost.time[0] = new MemoryPostTime();
        memoryPost.time[0].type = "year";
        memoryPost.time[0].data = "2018";
        memoryPost.location = new MemoryPostLocation[1];
        memoryPost.location[0] = new MemoryPostLocation();
        memoryPost.location[0].type = "region";
        memoryPost.location[0].name = "Istanbul";
        memoryPost.story = new MemoryPostStory[1];
        memoryPost.story[0] = new MemoryPostStory();
        memoryPost.story[0].type = "text";
        memoryPost.story[0].payload = "Kizkulesi is located off the coast of Salacak neighborhood in Üsküdar district, at the southern entrance of the Bosphorus. It literally means 'Maiden's Tower' in Turkish. The name comes from a legend: the Byzantine emperor heard a prophecy telling him that his beloved daughter would die at the age of 18 by a snake. So he decided to put her in this tower built on a rock on the Bosphorus isolated from the land thus no snake could kill her. But she couldn't escape from her destiny after all, a snake hidden in a fruit basket brought from the city bit the princess and killed her.";


        final Call<MemoryPost> call = apiEndpoints.createMemoryPost("Token dc751389c86229c89c00d88d74211c1d77f07bc6",memoryPost);*/

        final Call<MemoryPostPage> call = apiEndpoints.getMemoryPosts();

        call.enqueue(new Callback<MemoryPostPage>() {
            @Override
            public void onResponse(Call<MemoryPostPage> call, Response<MemoryPostPage> response) {
                if (response.isSuccessful()) {
                    Log.d("Success" , String.valueOf(response.body().count));

                    Toast.makeText(HomePageActivity.this, "Successfully got memory posts", Toast.LENGTH_SHORT).show();
                } else {
                    Log.d("Failure", response.toString());
                    Toast.makeText(HomePageActivity.this, "Error", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<MemoryPostPage> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(HomePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
    }
    public void signout(View view){
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        String token = prefs.getString("auth_token", "");
        if (token.equals("")){
            Toast.makeText(HomePageActivity.this, "Not Logged In", Toast.LENGTH_SHORT).show();
        }
        else{
            if (!waitingResponse){
                waitingResponse = true;
                Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

                ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

                token = "Token " + token;

                final Call<User> call = apiEndpoints.signOut(token);
                call.enqueue(new Callback<User>() {
                    @Override
                    public void onResponse(Call<User> call, Response<User> response) {
                            Toast.makeText(HomePageActivity.this, "Successfully signed out", Toast.LENGTH_SHORT).show();
                            waitingResponse = false;

                    }

                    @Override
                    public void onFailure(Call<User> call, Throwable t) {
                        Log.d("Error", t.getMessage());
                        Toast.makeText(HomePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                });
            }
            else {
                Toast.makeText(HomePageActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
