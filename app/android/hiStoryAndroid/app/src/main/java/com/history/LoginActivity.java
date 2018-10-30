package com.history;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.AsyncTask;
import android.os.StrictMode;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.Toast;

import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.converter.gson.GsonConverterFactory;


import java.util.ArrayList;

import retrofit2.Retrofit;
import retrofit2.http.Field;
import retrofit2.http.POST;

import static junit.framework.Assert.assertTrue;

public class LoginActivity extends AppCompatActivity {

    String SERVER_URL = "https://history-backend.herokuapp.com";

    boolean waitingResponse = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_login);

    }

    public void checkUserData(){
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        String auth_token = prefs.getString("auth_token", "");
        if (!auth_token.equals("")) {
            skipToHomepage(null);
        }
    }
    public void login(View view){

        if (!waitingResponse){
            waitingResponse = true;
            Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

            String identity = ((EditText)findViewById(R.id.userIdentityEditText)).getText().toString();
            String password = ((EditText)findViewById(R.id.passwordEditText)).getText().toString();
            User user = new User(identity, password);

            final Call<User> call = apiEndpoints.signIn(user);
            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful()) {
                        Log.d("Success" , String.valueOf(response.body().confirmed));
                        Toast.makeText(LoginActivity.this, "Welcome " + response.body().first_name, Toast.LENGTH_SHORT).show();
                        login(response.body());
                    } else {
                        Log.d("Failure", response.toString());
                        Toast.makeText(LoginActivity.this, "Authentication Failed", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    Log.d("Error", t.getMessage());
                    Toast.makeText(LoginActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    waitingResponse = false;
                }
            });
        }
        else {
            Toast.makeText(LoginActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
        }

    }

    public void login(User user){
        saveUser(user);
        skipToHomepage(null);
    }
    public void saveUser(User user){
        SharedPreferences.Editor editor = getSharedPreferences("userInfo", MODE_PRIVATE).edit();
        editor.putString("username", user.username);
        editor.putString("email", user.email);
        editor.putString("first_name", user.first_name);
        editor.putString("last_name", user.last_name);
        editor.putBoolean("admin", user.admin);
        editor.putBoolean("confirmed", user.confirmed);
        editor.putBoolean("banned", user.banned);
        editor.putString("auth_token", user.auth_token);
        editor.apply();
        System.out.println(user.username + " " + user.email + " " + user.first_name + " " + user.last_name + " " + user.admin + " " + user.confirmed + " " + user.banned + " " + user.auth_token);
    }
    public void openRegisterActivity(View view){
        Intent intent = new Intent(this, RegisterActivity.class);
        startActivity(intent);
        finish();
    }
    public void skipToHomepage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }
    public void passwordReset(View view){
        if (!waitingResponse){
            waitingResponse = true;
            Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

            String email = ((EditText)findViewById(R.id.userIdentityEditText)).getText().toString();
            User user = new User(email);

            final Call<User> call = apiEndpoints.passwordReset(user);
            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful()) {
                        Log.d("Success" , String.valueOf(response.body().confirmed));
                        Toast.makeText(LoginActivity.this, "An Email with Password Reset Instructions Sent", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    } else {
                        Log.d("Failure", response.toString());
                        Toast.makeText(LoginActivity.this, "Please type a valid email address", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    Log.d("Error", t.getMessage());
                    Toast.makeText(LoginActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    waitingResponse = false;
                }
            });
        }
        else {
            Toast.makeText(LoginActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
        }
    }
}
