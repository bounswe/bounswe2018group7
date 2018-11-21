package com.history;


import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CreatePostActivity extends AppCompatActivity {

    String SERVER_URL = "https://history-backend.herokuapp.com";

    String day_;
    String month_;
    String year_;
    String auth_token;
    boolean waitingResponse = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getSupportActionBar().hide();
        setContentView(R.layout.activity_create_post);
        checkUserData();
    }

    public void checkUserData(){
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        auth_token = prefs.getString("authToken", "");
    }


    public void showDatePicker(View v) {
        DialogFragment newFragment = new MyDatePickerFragment();
        newFragment.show(getSupportFragmentManager(), "date picker");


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

            String newTitle = ((EditText)findViewById(R.id.titleEditText)).getText().toString();
            //String newTime = ((EditText)findViewById(R.id.timeEditText)).getText().toString();
            String newLocation = ((EditText)findViewById(R.id.locationEditText)).getText().toString();
            String newStoryBody = ((EditText)findViewById(R.id.storyEditText)).getText().toString();


            String exampleTitle = newTitle;
            //String exampleTime = "{\"type\": \"duration\", \"data\": [\"1980\", \"1990\"]}";
            String exampleTime2 = "{\"type\": \"certainTime\", \"data\": [\""+ day_ +"\", \""+ month_ +"\", \""+year_+"\"]}";

            String exampleLocation = "[{\"type\": \"region\", \"name\": \" "+ newLocation +"\"}]";

            String exampleStoryBody= "Kizkulesi is located off the coast of Salacak neighborhood in Üsküdar district, " +
                    "at the southern entrance of the Bosphorus. It literally means 'Maiden's Tower' in Turkish. " +
                    "The name comes from a legend: the Byzantine emperor heard a prophecy telling him " +
                    "that his beloved daughter would die at the age of 18 by a snake. So he decided to put her " +
                    "in this tower built on a rock on the Bosphorus isolated from the land thus no snake could kill her. " +
                    "But she couldn't escape from her destiny after all, a snake hidden in a fruit basket brought from the city " +
                    "bit the princess and killed her.";


            RequestBody title = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleTitle);

            RequestBody time = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleTime2);

            RequestBody location = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleLocation);

            List<MultipartBody.Part> story = new ArrayList<>();

            MultipartBody.Part storyBody = MultipartBody.Part.createFormData( "story[0]",  newStoryBody);

            story.add(storyBody);

            if (auth_token.equals("")) auth_token = "a5f6fda9c2ef6afc4b55f6000ecdd8475b230c24";
            final Call<ResponseBody> call = apiEndpoints.uploadMultipleFiles("Token " + auth_token, title,time,location,story);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    Toast.makeText(CreatePostActivity.this, "Response???", Toast.LENGTH_SHORT).show();
                    if (response.isSuccessful()) {
                        //Log.d("Success" , String.valueOf(response.body().title));
                        Toast.makeText(CreatePostActivity.this, "Post Created", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                        backToHomePage(null);

                    } else {
                        Log.d("Failure", response.toString());
                        Toast.makeText(CreatePostActivity.this, "Could not create post.", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
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

    public void create(View view){
        createPost(null);
    }

    public void addImage(View view){

    }

    public void backToHomePage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }

}