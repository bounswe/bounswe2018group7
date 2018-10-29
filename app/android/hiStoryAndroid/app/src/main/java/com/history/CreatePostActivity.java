package com.history;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
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

            String firstName = ((EditText)findViewById(R.id.getFirstNameEditText)).getText().toString();
            String lastName = ((EditText)findViewById(R.id.getLastNameEditText)).getText().toString();


//            final Call<User> call = apiEndpoints.signUp(user);
//            call.enqueue(new Callback<User>() {
//                @Override
//                public void onResponse(Call<User> call, Response<User> response) {
//                    if (response.isSuccessful()) {
//                        Log.d("Success" , String.valueOf(response.body().username));
//                        Toast.makeText(CreatePostActivity.this, "Welcome " + response.body().first_name, Toast.LENGTH_SHORT).show();
//                        signUp(response.body());
//
//                    } else {
//                        Log.d("Failure", response.toString());
//                        Toast.makeText(CreatePostActivity.this, "Authentication Failed", Toast.LENGTH_SHORT).show();
//                        waitingResponse = false;
//                    }
//                }
//
//                @Override
//                public void onFailure(Call<User> call, Throwable t) {
//                    Log.d("Error", t.getMessage());
//                    Toast.makeText(CreatePostActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
//                    waitingResponse = false;
//                }
//            });
        }
        else {
            Toast.makeText(CreatePostActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
        }

    }

    public void createPost(User user){

    }

    public void addImage(View view){

    }

    public void backToHomePage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }

}
