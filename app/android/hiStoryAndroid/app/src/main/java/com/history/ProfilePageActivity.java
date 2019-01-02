package com.history;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ProfilePageActivity extends AppCompatActivity {
    String username;
    String authToken;
    String SERVER_URL = "https://history-backend.herokuapp.com";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_page);

        getSupportActionBar().hide();

        Bundle extras = getIntent().getExtras();
        username = (String) extras.get("username");
        authToken = (String) extras.get("authToken");

        getProfile();
    }
    public void getProfile(){
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        // set your desired log level
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        httpClient.addInterceptor(logging);

        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory
                (GsonConverterFactory.create()).client(httpClient.build()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);


        final Call<Map> call = apiEndpoints.getProfile("Token " + authToken, username);
        call.enqueue(new Callback<Map>() {
            @Override
            public void onResponse(Call<Map> call, Response<Map> response) {
                Toast.makeText(ProfilePageActivity.this, "Successfully got profile", Toast
                        .LENGTH_SHORT)
                        .show();
                System.out.println(response.body());
            }

            @Override
            public void onFailure(Call<Map> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(ProfilePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
