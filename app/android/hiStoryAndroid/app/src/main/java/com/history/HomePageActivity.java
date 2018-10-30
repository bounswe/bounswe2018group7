package com.history;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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
    Button signoutButton;
    boolean signedIn = false;
    String auth_token = "";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_home_page);
        checkUserData();
        getMemoryPosts();
    }

    public void checkUserData(){
        signoutButton = findViewById(R.id.signoutButton);
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        auth_token = prefs.getString("auth_token", "");
        if (auth_token.equals("")){
            signoutButton.setText("Log In");
        }
        else {
            signedIn = true;
        }
    }
    public void getMemoryPosts(){


        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);


        final Call<MemoryPostPage> call = apiEndpoints.getMemoryPosts();

        call.enqueue(new Callback<MemoryPostPage>() {
            @Override
            public void onResponse(Call<MemoryPostPage> call, Response<MemoryPostPage> response) {
                if (response.isSuccessful()) {
                    if (response.body().count > 0){
                        listPosts(response.body());
                        Log.d("Memory Posts", response.body().results.get(0).story[0].payload.toString());
                    }
                    Toast.makeText(HomePageActivity.this, "Successfully got memory posts", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<MemoryPostPage> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(HomePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void listPosts(MemoryPostPage memoryPostPage){
        for (int i=0; i< memoryPostPage.count; i++){
            MemoryPost memoryPost = memoryPostPage.results.get(0);
            System.out.println(memoryPost.title);
            for (int j=0; j<memoryPost.story.length; j++){
                System.out.println(memoryPost.story[j].payload.toString());
            }
        }
    }
    public void signout(View view){
        if (!signedIn){
            openLoginActivity();
        }
        else{
                signedIn = false;
                signoutButton.setText("Log In");
                Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

                ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);
                auth_token = "Token " + auth_token;
                SharedPreferences.Editor editor = getSharedPreferences("userInfo", MODE_PRIVATE).edit();
                editor.putString("auth_token", "");
                editor.apply();
                final Call<User> call = apiEndpoints.signOut(auth_token);
                call.enqueue(new Callback<User>() {
                    @Override
                    public void onResponse(Call<User> call, Response<User> response) {
                            Toast.makeText(HomePageActivity.this, "Successfully signed out", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(Call<User> call, Throwable t) {
                        Log.d("Error", t.getMessage());
                        Toast.makeText(HomePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    }
                });
                auth_token = "";
        }
    }

    public void openLoginActivity(){
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }

    public void openCreatePostActivity(View view){
        Intent intent = new Intent(this, CreatePostActivity.class);
        startActivity(intent);
    }
}
