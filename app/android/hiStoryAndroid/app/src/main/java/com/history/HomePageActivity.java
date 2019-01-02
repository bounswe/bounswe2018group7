package com.history;

import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import com.google.android.gms.maps.MapFragment;
import com.squareup.picasso.Picasso;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HomePageActivity extends AppCompatActivity implements ScrollView.OnScrollChangeListener {
    String SERVER_URL = "https://history-backend.herokuapp.com";
    Button signoutButton;
    boolean signedIn = false;
    boolean waiting = false;
    String authToken = "";
    RelativeLayout mainLayout;
    int screenWidth, screenHeight;
    Integer lastViewId;
    MemoryPostPage memoryPostPage;
    ScrollView memoryPostsView;
    RelativeLayout memoryPostsLayout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_home_page);
        mainLayout =  findViewById(R.id.homePageActivityMainLayout);
        getScreenSize();
        checkUserData();
        getMemoryPosts(null);

       /* final Intent intent = new Intent(Intent.ACTION_VIEW,
                Uri.parse("http://maps.google.com/maps?" + "saddr="+"41.85073"+"," + ""+"-87.65126"+"&daddr="+"41.85258"+", "+"-87.65141"));
        intent.setClassName(
                "com.google.android.apps.maps",
                "com.google.android.maps.MapsActivity");
        startActivity(intent);    */
    }

    public void checkUserData(){
        signoutButton = findViewById(R.id.signoutButton);
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        authToken = prefs.getString("authToken", "");
        if (authToken.equals("")){
            signoutButton.setText("Log In");
        }
        else {
            signedIn = true;
        }
    }
    public void getMemoryPosts(String page){


        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        // set your desired log level
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        httpClient.addInterceptor(logging);

        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).client(httpClient.build()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

        final Call<MemoryPostPage> call;
        if (signedIn) call  = apiEndpoints.getMemoryPostsUser("Token " + authToken, page);
        else call = apiEndpoints.getMemoryPostsGuest();

        waiting = true;
        call.enqueue(new Callback<MemoryPostPage>() {
            @Override
            public void onResponse(Call<MemoryPostPage> call, Response<MemoryPostPage> response) {
                if (response.isSuccessful()) {
                    waiting = false;
                    if (response.body().count > 0){
                        memoryPostPage = response.body();
                        listPosts();
                    }
                    Toast.makeText(HomePageActivity.this, "Successfully got memory posts ", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<MemoryPostPage> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(HomePageActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });



    }

    public void listPosts(){

        if (memoryPostsView == null){
            memoryPostsView = new ScrollView(this);
            RelativeLayout.LayoutParams paramsMemoryPostsView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            memoryPostsView.setBackgroundColor(Color.parseColor("#cceeddbb"));
            mainLayout.addView(memoryPostsView, paramsMemoryPostsView);
            memoryPostsView.setOnScrollChangeListener(this);

            memoryPostsLayout = new RelativeLayout(this);
            RelativeLayout.LayoutParams paramsMemoryPostsLayout = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            memoryPostsView.addView(memoryPostsLayout, paramsMemoryPostsLayout);
        }



        for (int i=0; i< memoryPostPage.results.size(); i++){
            MemoryPost memoryPost = memoryPostPage.results.get(i);

            ScrollView memoryPostView = new ScrollView(this);
            memoryPostView.setId(View.generateViewId());
            RelativeLayout.LayoutParams paramsMemoryPostView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            memoryPostView.setPadding(screenWidth/30, screenWidth/30, screenWidth/30, screenWidth/30);
            if (lastViewId != null) paramsMemoryPostView.addRule(RelativeLayout.BELOW, lastViewId);
            lastViewId = memoryPostView.getId();
            memoryPostsLayout.addView(memoryPostView, paramsMemoryPostView);



            GradientDrawable memoryPostBorder =  new GradientDrawable();
            memoryPostBorder.setCornerRadius(screenWidth/30);
            memoryPostBorder.setColor(Color.parseColor("#f8f8f0"));
            RelativeLayout memoryPostLayout = new RelativeLayout(this);
            memoryPostLayout.setPadding(screenWidth/30, screenWidth/30, screenWidth/30, screenWidth/30);
            memoryPostLayout.setBackground(memoryPostBorder);
            RelativeLayout.LayoutParams paramsMemoryPostLayout = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            memoryPostView.addView(memoryPostLayout, paramsMemoryPostLayout);
            memoryPostLayout.setTag(memoryPost.id);
            if (signedIn){
                memoryPostLayout.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(HomePageActivity.this, MemoryPostDetailActivity.class);
                        intent.putExtra("memoryPostId", (int)v.getTag());
                        intent.putExtra("authToken", authToken);
                        startActivity(intent);
                    }
                });
            }



            RelativeLayout memoryPostInfoLayout = new RelativeLayout(this);
            RelativeLayout.LayoutParams paramsMemoryPostInfoLayout = new RelativeLayout
                    .LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, screenHeight/10);
            memoryPostInfoLayout.setId(View.generateViewId());
            memoryPostInfoLayout.setPadding(0, 0, 0, 2);
            memoryPostLayout.addView(memoryPostInfoLayout, paramsMemoryPostInfoLayout);

            View line = new View(this);
            RelativeLayout.LayoutParams paramsLine = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 2);
            line.setBackgroundColor(Color.BLACK);
            paramsLine.addRule(RelativeLayout.BELOW, memoryPostInfoLayout.getId());
            memoryPostLayout.addView(line, paramsLine);

            ImageView profilPicture = new ImageView(this);
            profilPicture.setBackgroundResource(R.drawable.einstein);
            profilPicture.setId(View.generateViewId());
            memoryPostInfoLayout.addView(profilPicture);

            TextView authorTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsAuthorTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            authorTextView.setText(memoryPost.username);
            authorTextView.setTextSize(25);
            authorTextView.setId(View.generateViewId());
            authorTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            paramsAuthorTextView.addRule(RelativeLayout.RIGHT_OF , profilPicture.getId());
            memoryPostInfoLayout.addView(authorTextView, paramsAuthorTextView);

            TextView createdTimeTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsCreatedTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            createdTimeTextView.setText(memoryPost.created);
            createdTimeTextView.setTextSize(20);
            createdTimeTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            paramsCreatedTimeTextView.addRule(RelativeLayout.RIGHT_OF , profilPicture.getId());
            paramsCreatedTimeTextView.addRule(RelativeLayout.BELOW, authorTextView.getId());
            memoryPostInfoLayout.addView(createdTimeTextView, paramsCreatedTimeTextView);

            TextView titleTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTitleTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            titleTextView.setText(memoryPost.title);
            titleTextView.setTextSize(30);
            titleTextView.setGravity(Gravity.CENTER);
            titleTextView.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
            paramsTitleTextView.addRule(RelativeLayout.BELOW, memoryPostInfoLayout.getId());
            titleTextView.setId(View.generateViewId());
            memoryPostLayout.addView(titleTextView, paramsTitleTextView);


            int id = titleTextView.getId();

            int k=0;
            for (int j=0; j<memoryPost.story.length; j++){
                System.out.println("Story element type: " + memoryPost.story[j].type);
                if ((k==0) && !memoryPost.story[j].type.equals("text")){
                    k++;
                    if (memoryPost.story[j].type.equals("text")){
                        TextView storyTextView = new TextView(this);
                        RelativeLayout.LayoutParams paramsStoryTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        storyTextView.setText(memoryPost.story[j].payload.toString());
                        storyTextView.setTextSize(20);
                        paramsStoryTextView.addRule(RelativeLayout.BELOW, id);
                        storyTextView.setId(View.generateViewId());
                        id = storyTextView.getId();
                        memoryPostLayout.addView(storyTextView, paramsStoryTextView);
                    }
                    else if(memoryPost.story[j].type.contains("image")){
                        ImageView storyImageView = new ImageView(this);
                        Picasso.get().load(memoryPost.story[j].payload.toString()).into(storyImageView);
                        RelativeLayout.LayoutParams paramsStoryImageView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        paramsStoryImageView.addRule(RelativeLayout.BELOW, id);
                        storyImageView.setId(View.generateViewId());
                        id = storyImageView.getId();
                        memoryPostLayout.addView(storyImageView, paramsStoryImageView);
                    }
                    else if(memoryPost.story[j].type.contains("video")){

                        RelativeLayout videoLayout = new RelativeLayout(this);
                        RelativeLayout.LayoutParams paramsVideoLayout = new RelativeLayout
                                .LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT,
                                screenHeight/5);
                        paramsVideoLayout.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        paramsVideoLayout.addRule(RelativeLayout.BELOW, id);
                        videoLayout.setId(View.generateViewId());
                        id = videoLayout.getId();
                        memoryPostLayout.addView(videoLayout, paramsVideoLayout);


                        final VideoView videoView = new VideoView(this);
                        videoView.setVideoPath(((String) memoryPost.story[j].payload));
                        RelativeLayout.LayoutParams paramsVideoView = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                        videoLayout.addView(videoView, paramsVideoView);
                        paramsVideoView.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        videoView.seekTo( 5 );

                        TextView button = new TextView(this);
                        RelativeLayout.LayoutParams paramsButton = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                        button.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (videoView.isPlaying()) videoView.pause();
                                else videoView.start();
                            }
                        });
                        videoLayout.addView(button, paramsButton);
                    }
                }
            }
            if ((k==0) && (memoryPost.story.length != 0)){
                TextView storyTextView = new TextView(this);
                RelativeLayout.LayoutParams paramsStoryTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                storyTextView.setText(memoryPost.story[0].payload.toString());
                storyTextView.setTextSize(20);
                paramsStoryTextView.addRule(RelativeLayout.BELOW, id);
                storyTextView.setId(View.generateViewId());
                id = storyTextView.getId();
                memoryPostLayout.addView(storyTextView, paramsStoryTextView);
            }


            if (memoryPost.time != null){
                TextView timeTextView = new TextView(this);
                RelativeLayout.LayoutParams paramsTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                if (memoryPost.time.data != null) timeTextView.setText(memoryPost.time.data.toString());
                timeTextView.setTextSize(25);
                paramsTimeTextView.addRule(RelativeLayout.BELOW, id);
                timeTextView.setId(View.generateViewId());
                id = timeTextView.getId();
                memoryPostLayout.addView(timeTextView, paramsTimeTextView);
            }
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
            authToken = "Token " + authToken;
            SharedPreferences.Editor editor = getSharedPreferences("userInfo", MODE_PRIVATE).edit();
            editor.putString("authToken", "");
            editor.apply();
            final Call<User> call = apiEndpoints.signOut(authToken);
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
            authToken = "";
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

    @Override
    public void onScrollChange(View view, int x, int y, int oldX, int oldY){
        if (y >= (((ScrollView) view).getChildAt(0).getHeight() - view.getHeight())){
            if (!waiting && (memoryPostPage.next != null)){
                getMemoryPosts(memoryPostPage.next.substring(memoryPostPage.next.indexOf("=")
                + 1));
            }
        }
    }
}