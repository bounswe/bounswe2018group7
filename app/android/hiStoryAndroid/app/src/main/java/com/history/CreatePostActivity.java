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

    public void createPost(View view){

        if (!waitingResponse){
            waitingResponse = true;
            Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);


            MemoryPost memoryPost = new MemoryPost();
            memoryPost.title = "The Maiden's tower";
            memoryPost.location = "[\"1985\"]";
            memoryPost.time = "[\"Istanbul\"]";
            memoryPost.story[0] = "Kizkulesi is located off the coast of Salacak neighborhood in Üsküdar district, " +
                "at the southern entrance of the Bosphorus. It literally means 'Maiden's Tower' in Turkish. " +
                "The name comes from a legend: the Byzantine emperor heard a prophecy telling him that his beloved daughter " +
                "would die at the age of 18 by a snake. So he decided to put her in this tower built on a rock on the Bosphorus " +
                "isolated from the land thus no snake could kill her. But she couldn't escape from her destiny after all," +
                " a snake hidden in a fruit basket brought from the city bit the princess and killed her.";

//            memoryPost.time = new MemoryPostTime[1];
//            memoryPost.time[0] = new MemoryPostTime();
//            memoryPost.time[0].type = "year";
//            memoryPost.time[0].data = "2018";
//            memoryPost.location = new MemoryPostLocation[1];
//            memoryPost.location[0] = new MemoryPostLocation();
//            memoryPost.location[0].type = "region";
//            memoryPost.location[0].name = "Istanbul";
//            memoryPost.story = new MemoryPostStory[1];
//            memoryPost.story[0] = new MemoryPostStory();
//            memoryPost.story[0].type = "text";
//            memoryPost.story[0].payload = "Kizkulesi is located off the coast of Salacak neighborhood in Üsküdar district, " +
//                "at the southern entrance of the Bosphorus. It literally means 'Maiden's Tower' in Turkish. " +
//                "The name comes from a legend: the Byzantine emperor heard a prophecy telling him that his beloved daughter " +
//                "would die at the age of 18 by a snake. So he decided to put her in this tower built on a rock on the Bosphorus " +
//                "isolated from the land thus no snake could kill her. But she couldn't escape from her destiny after all," +
//                " a snake hidden in a fruit basket brought from the city bit the princess and killed her.";

//            String title = ((EditText)findViewById(R.id.titleEditText)).getText().toString();
//            MemoryPostTime time = ((EditText)findViewById(R.id.timeEditText)).getText().toString();
//            String location = ((EditText)findViewById(R.id.locationEditText)).getText().toString();
//            String story = ((EditText)findViewById(R.id.storyEditText)).getText().toString();
//
//            MemoryPost memoryPost = new MemoryPost(title,time,location,story);


            final Call<MemoryPost> call = apiEndpoints.createMemoryPost("Token 0f7df0f96d41426b788bfcc6ebdb96a20642dccc", memoryPost);
            call.enqueue(new Callback<MemoryPost>() {
                @Override
                public void onResponse(Call<MemoryPost> call, Response<MemoryPost> response) {
                    if (response.isSuccessful()) {
                        //Log.d("Success" , String.valueOf(response.body().title));
                        Toast.makeText(CreatePostActivity.this, "Post Created", Toast.LENGTH_SHORT).show();
                        createPost(response.body());

                    } else {
                        //Log.d("Failure", response.toString());
                        Toast.makeText(CreatePostActivity.this, "Could not create post.", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<MemoryPost> call, Throwable t) {
                    //Log.d("Error", t.getMessage());
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
