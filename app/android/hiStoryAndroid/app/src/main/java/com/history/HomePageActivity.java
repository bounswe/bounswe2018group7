package com.history;

import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public class HomePageActivity extends AppCompatActivity {
    String SERVER_URL = "https://history-backend.herokuapp.com";
    Button signoutButton;
    boolean signedIn = false;
    String auth_token = "";
    RelativeLayout mainLayout;
    int screenWidth, screenHeight;
    int lastViewId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_home_page);
        mainLayout =  findViewById(R.id.homePageActivityMainLayout);
        getScreenSize();
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

        ScrollView memoryPostsView = new ScrollView(this);
        RelativeLayout.LayoutParams paramsMemoryPostsView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        mainLayout.addView(memoryPostsView, paramsMemoryPostsView);

        RelativeLayout memoryPostsLayout = new RelativeLayout(this);
        RelativeLayout.LayoutParams paramsMemoryPostsLayout = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        memoryPostsView.addView(memoryPostsLayout, paramsMemoryPostsLayout);


        for (int i=0; i< memoryPostPage.count; i++){
            MemoryPost memoryPost = memoryPostPage.results.get(i);

            ScrollView memoryPostView = new ScrollView(this);
            memoryPostView.setId(View.generateViewId());
            RelativeLayout.LayoutParams paramsMemoryPostView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            memoryPostView.setPadding(screenWidth/30, screenWidth/30, screenWidth/30, screenWidth/30);
            if (i>0) paramsMemoryPostView.addRule(RelativeLayout.BELOW, lastViewId);
            lastViewId = memoryPostView.getId();
            memoryPostsLayout.addView(memoryPostView, paramsMemoryPostView);

            GradientDrawable memoryPostBorder =  new GradientDrawable();
            memoryPostBorder.setStroke(screenWidth/360, Color.GRAY);
            RelativeLayout memoryPostLayout = new RelativeLayout(this);
            memoryPostLayout.setBackground(memoryPostBorder);
            RelativeLayout.LayoutParams paramsMemoryPostLayout = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            memoryPostView.addView(memoryPostLayout, paramsMemoryPostLayout);

            RelativeLayout memoryPostInfoLayout = new RelativeLayout(this);
            RelativeLayout.LayoutParams paramsMemoryPostInfoLayout = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            memoryPostInfoLayout.setId(View.generateViewId());
            memoryPostInfoLayout.setBackground(memoryPostBorder);
            memoryPostInfoLayout.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            memoryPostLayout.addView(memoryPostInfoLayout, paramsMemoryPostInfoLayout);

            ImageView profilPicture = new ImageView(this);
            profilPicture.setBackgroundResource(R.drawable.default_pp);
            profilPicture.setId(View.generateViewId());
            memoryPostInfoLayout.addView(profilPicture);

            TextView authorTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsAuthorTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            authorTextView.setText(memoryPost.username);
            authorTextView.setTextSize(25);
            authorTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            paramsAuthorTextView.addRule(RelativeLayout.RIGHT_OF , profilPicture.getId());
            memoryPostInfoLayout.addView(authorTextView, paramsAuthorTextView);

            TextView createdTimeTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsCreatedTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            createdTimeTextView.setText(memoryPost.created);
            createdTimeTextView.setTextSize(25);
            createdTimeTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            paramsCreatedTimeTextView.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            memoryPostInfoLayout.addView(createdTimeTextView, paramsCreatedTimeTextView);

            TextView titleTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTitleTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            titleTextView.setText(memoryPost.title);
            titleTextView.setTextSize(30);
            titleTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            titleTextView.setBackground(memoryPostBorder);
            paramsTitleTextView.addRule(RelativeLayout.BELOW, memoryPostInfoLayout.getId());
            titleTextView.setId(View.generateViewId());
            memoryPostLayout.addView(titleTextView, paramsTitleTextView);


            int id = titleTextView.getId();
            for (int j=0; j<memoryPost.story.length; j++){
                TextView storyTextView = new TextView(this);
                RelativeLayout.LayoutParams paramsStoryTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                storyTextView.setText(memoryPost.story[j].payload.toString());
                storyTextView.setTextSize(20);
                paramsStoryTextView.addRule(RelativeLayout.BELOW, id);
                storyTextView.setId(View.generateViewId());
                id = storyTextView.getId();
                memoryPostLayout.addView(storyTextView, paramsStoryTextView);
            }

            TextView tagTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTagTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            tagTextView.setText("Tags: " + memoryPost.tags);
            tagTextView.setTextSize(15);
            paramsTagTextView.addRule(RelativeLayout.BELOW, id);
            tagTextView.setId(View.generateViewId());
            memoryPostLayout.addView(tagTextView, paramsTagTextView);

            TextView timeTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            timeTextView.setText("Time: " + memoryPost.time);
            timeTextView.setTextSize(15);
            paramsTimeTextView.addRule(RelativeLayout.BELOW, tagTextView.getId());
            timeTextView.setId(View.generateViewId());
            memoryPostLayout.addView(timeTextView, paramsTimeTextView);

            TextView locationTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsLocationTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            locationTextView.setText("Locations: " + memoryPost.location);
            locationTextView.setTextSize(15);
            paramsLocationTextView.addRule(RelativeLayout.BELOW, timeTextView.getId());
            locationTextView.setId(View.generateViewId());
            memoryPostLayout.addView(locationTextView, paramsLocationTextView);

            RelativeLayout map = new RelativeLayout(this);
            RelativeLayout.LayoutParams paramsMap = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, screenHeight/2);
            paramsLocationTextView.addRule(RelativeLayout.BELOW, timeTextView.getId());
            paramsMap.addRule(RelativeLayout.BELOW, timeTextView.getId());
            map.setId(View.generateViewId());
            memoryPostLayout.addView(map);

            MapFragment mMapFragment = MapFragment.newInstance();
            FragmentTransaction fragmentTransaction =
                    getFragmentManager().beginTransaction();
            fragmentTransaction.add(map.getId(), mMapFragment);
            fragmentTransaction.commit();

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

    void getScreenSize() {
        android.view.Display display = getWindowManager().getDefaultDisplay();
        android.graphics.Point size = new android.graphics.Point();
        display.getSize(size);
        screenWidth = size.x;
        screenHeight = size.y;
    }
}
