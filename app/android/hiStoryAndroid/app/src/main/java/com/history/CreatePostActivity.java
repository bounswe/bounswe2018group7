package com.history;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CreatePostActivity extends AppCompatActivity {

    String SERVER_URL = "https://history-backend.herokuapp.com";

    boolean waitingResponse = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getSupportActionBar().hide();
        setContentView(R.layout.activity_create_post);
    }

    public void register(View view){

        if (!waitingResponse){
            waitingResponse = true;
            Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

            String title = ((EditText)findViewById(R.id.titleEditText)).getText().toString();
            String time = ((EditText)findViewById(R.id.timeEditText)).getText().toString();
            String location = ((EditText)findViewById(R.id.locationEditText)).getText().toString();
            String story = ((EditText)findViewById(R.id.storyEditText)).getText().toString();

            MemoryPost memoryPost = new MemoryPost(title,time,location,story);


            final Call<MemoryPost> call = apiEndpoints.createPost(memoryPost);
            call.enqueue(new Callback<MemoryPost>() {
                @Override
                public void onResponse(Call<MemoryPost> call, Response<MemoryPost> response) {
                    if (response.isSuccessful()) {
                        Log.d("Success" , String.valueOf(response.body().title));
                        Toast.makeText(CreatePostActivity.this, "Post Created", Toast.LENGTH_SHORT).show();
                        createPost(response.body());

                    } else {
                        Log.d("Failure", response.toString());
                        Toast.makeText(CreatePostActivity.this, "Could not create post.", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<MemoryPost> call, Throwable t) {
                    Log.d("Error", t.getMessage());
                    Toast.makeText(CreatePostActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    waitingResponse = false;
                }
            });
        }
        else {
            Toast.makeText(CreatePostActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
        }

    }

    public void createPost(MemoryPost memoryPost){
        backToHomePage(null);
    }

    public void addImage(View view){

    }

    public void backToHomePage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }

}
