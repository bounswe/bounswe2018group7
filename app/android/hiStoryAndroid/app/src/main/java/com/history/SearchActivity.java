package com.history;

import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class SearchActivity extends AppCompatActivity {
    String SERVER_URL = "https://history-backend.herokuapp.com";
    String authToken, searchText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        Bundle extras = getIntent().getExtras();
        searchText = (String) extras.get("searchText");
        authToken = (String) extras.get("authToken");
        search();
    }
    public void search(){

        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        // set your desired log level
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        httpClient.addInterceptor(logging);

        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory
                (GsonConverterFactory.create()).client(httpClient.build()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

        SearchBody sb = new SearchBody();
        sb.text = searchText;
        final Call<Map> call = apiEndpoints.search("Token " + authToken, sb);
        call.enqueue(new Callback<Map>() {
            @Override
            public void onResponse(Call<Map> call, Response<Map> response) {
                Toast.makeText(SearchActivity.this, "Successfully searched", Toast.LENGTH_SHORT).show();
                ArrayList users = (ArrayList) response.body().get("users");
                if (users.size() > 0) addUsers(users);
                Map memoryPosts = ((Map) response.body().get("memory_posts"));
                if (memoryPosts.size() > 0) addMemoryPosts(memoryPosts);
            }

            @Override
            public void onFailure(Call<Map> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(SearchActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
        authToken = "";
    }
    public void addUsers(ArrayList users){
        
    }
    public void addMemoryPosts(Map memoryPosts){

    }
}
