package com.history;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.FormBody;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;



public class CreatePostActivity extends AppCompatActivity {

    String SERVER_URL = "http://192.168.6.61:8000";

    boolean waitingResponse = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getSupportActionBar().hide();
        setContentView(R.layout.activity_create_post);
        createPost(null);
    }

    public void createPost(View view){

        if (!waitingResponse){
            waitingResponse = true;


            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            // set your desired log level
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
            // add your other interceptors …

            // add logging as last interceptor
            httpClient.addInterceptor(logging);  // <-- this is the important line!


            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(SERVER_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build();


            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);



//            String title = ((EditText)findViewById(R.id.titleEditText)).getText().toString();
//            MemoryPostTime time = ((EditText)findViewById(R.id.timeEditText)).getText().toString();
//            String location = ((EditText)findViewById(R.id.locationEditText)).getText().toString();
//            String story = ((EditText)findViewById(R.id.storyEditText)).getText().toString();
//
//            MemoryPost memoryPost = new MemoryPost(title,time,location,story);

            MemoryPost memoryPost = new MemoryPost();
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


            RequestBody myBody = RequestBody.create(
                    okhttp3.MultipartBody.FORM, "my title");

            List<MultipartBody.Part> story = new ArrayList<>();

            MultipartBody.Part storyBody = MultipartBody.Part.createFormData( "story[0]",  "my story text");

            story.add(storyBody);

//            Uri imageUri = null;
//
//            File file = new File(imageUri.getPath());

            // create upload service client

            final Call<ResponseBody> call = apiEndpoints.uploadMultipleFiles("Token 124fa23f3eee0c34a78b2c9030412f55f885d986", null, story );
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        //Log.d("Success" , String.valueOf(response.body().title));
                        Toast.makeText(CreatePostActivity.this, "Post Created", Toast.LENGTH_SHORT).show();

                    } else {
                        //Log.d("Failure", response.toString());
                        Toast.makeText(CreatePostActivity.this, "Could not create post.", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
//                    //Log.d("Error", t.getMessage());
//                    Toast.makeText(CreatePostActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
//                    waitingResponse = false;
                }
            });
        }
        else {
            Toast.makeText(CreatePostActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();

        }

    }

//    public void createPost(MemoryPost memoryPost){
//        backToHomePage(null);
//    }

    public void addImage(View view){

    }

    public void backToHomePage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }

}
