package com.history;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
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
    ScrollView mainLayout;
    RelativeLayout scrollLayout;
    int screenWidth, screenHeight;
    int lastViewId = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        getSupportActionBar().hide();
        mainLayout = findViewById(R.id.searchActivityMainLayout);
        scrollLayout = new RelativeLayout(this);
        mainLayout.addView(scrollLayout);

        getScreenSize();

        Bundle extras = getIntent().getExtras();
        searchText = (String) extras.get("searchText");
        authToken = (String) extras.get("authToken");
        System.out.println("abcde: " + authToken);
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
                if (((ArrayList) memoryPosts.get("ids")).size() > 0) addMemoryPosts(memoryPosts);
            }

            @Override
            public void onFailure(Call<Map> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(SearchActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
    }
    public void addUsers(ArrayList users){
        TextView usersTextView = new TextView(this);
        RelativeLayout.LayoutParams paramsUsersTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        usersTextView.setText("Users");
        usersTextView.setGravity(Gravity.CENTER);
        usersTextView.setTextSize(22);
        if (lastViewId != 0) paramsUsersTextView.addRule(RelativeLayout.BELOW, lastViewId);
        paramsUsersTextView.topMargin = 30;
        usersTextView.setId(View.generateViewId());
        lastViewId = usersTextView.getId();
        scrollLayout.addView(usersTextView, paramsUsersTextView);

        System.out.println("a");
        for (int i=0; i<users.size(); i++){
            System.out.println("b");
            final TextView usernameView = new TextView(this);
            RelativeLayout.LayoutParams paramsUsernameView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            usernameView.setText(((String) users.get(i)));
            usernameView.setTextSize(19);
            if (lastViewId != 0) paramsUsernameView.addRule(RelativeLayout.BELOW, lastViewId);
            paramsUsernameView.topMargin = 15;
            paramsUsernameView.leftMargin = 40;
            usernameView.setId(View.generateViewId());
            lastViewId = usernameView.getId();
            scrollLayout.addView(usernameView , paramsUsernameView);
            usernameView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(SearchActivity.this, ProfilePageActivity.class);
                    intent.putExtra("username", usernameView.getText());
                    intent.putExtra("authToken", authToken);
                    startActivity(intent);
                }
            });
        }
    }
    public void addMemoryPosts(Map memoryPosts){
        ArrayList ids = (ArrayList) memoryPosts.get("ids");
        ArrayList titles = (ArrayList) memoryPosts.get("titles");

        TextView memoryPostsTextView = new TextView(this);
        RelativeLayout.LayoutParams paramsMemoryPostsTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        memoryPostsTextView.setText("Memory Posts");
        memoryPostsTextView.setGravity(Gravity.CENTER);
        memoryPostsTextView.setTextSize(22);
        if (lastViewId != 0) paramsMemoryPostsTextView.addRule(RelativeLayout.BELOW, lastViewId);
        paramsMemoryPostsTextView.topMargin = 30;
        memoryPostsTextView.setId(View.generateViewId());
        lastViewId = memoryPostsTextView.getId();
        scrollLayout.addView(memoryPostsTextView , paramsMemoryPostsTextView);

        System.out.println("c");
        for (int i=0; i<titles.size(); i++){
            System.out.println("d");
            final TextView titleTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTitleTextView = new RelativeLayout.LayoutParams
                    (ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            titleTextView.setText(((String) titles.get(i)));
            titleTextView.setTextSize(19);
            if (lastViewId != 0) paramsTitleTextView.addRule(RelativeLayout.BELOW, lastViewId);
            paramsTitleTextView.topMargin = 15;
            paramsTitleTextView.leftMargin = 40;
            titleTextView.setId(View.generateViewId());
            lastViewId = titleTextView.getId();
            scrollLayout.addView(titleTextView ,paramsTitleTextView);
            titleTextView.setTag(ids.get(i));
            titleTextView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(SearchActivity.this, MemoryPostDetailActivity.class);
                    intent.putExtra("memoryPostId" ,Integer.valueOf(((Double) v.getTag())
                            .intValue()));
                    intent.putExtra("authToken", authToken);
                    System.out.println("c: " + authToken);
                    startActivity(intent);
                }
            });
        }
    }

    void getScreenSize() {
        android.view.Display display = getWindowManager().getDefaultDisplay();
        android.graphics.Point size = new android.graphics.Point();
        display.getSize(size);
        screenWidth = size.x;
        screenHeight = size.y;
    }

}
