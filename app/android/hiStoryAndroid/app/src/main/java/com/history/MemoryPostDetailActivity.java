package com.history;

import android.app.FragmentTransaction;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.MapFragment;
import com.squareup.picasso.Picasso;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MemoryPostDetailActivity extends AppCompatActivity {
	String SERVER_URL = "https://history-backend.herokuapp.com";
	int memoryPostId;
	String authToken;
	int screenWidth = 720, screenHeight = 1440;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_memory_post_detail);
		getSupportActionBar().hide();

		Bundle extras = getIntent().getExtras();
		memoryPostId = (int) extras.get("memoryPostId");
		authToken = (String) extras.get("authToken");

		getScreenSize();
		getMemoryPost();

	}
	public void getMemoryPost(){
		Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

		ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

		final Call<MemoryPost> call = apiEndpoints.getMemoryPost("Token " + authToken , Integer.toString(memoryPostId));
		System.out.println("auth token: " + authToken);


		call.enqueue(new Callback<MemoryPost>() {
			@Override
			public void onResponse(Call<MemoryPost> call, Response<MemoryPost> response) {
				Toast.makeText(MemoryPostDetailActivity.this, "Successfully got memory post", Toast.LENGTH_SHORT).show();
				System.out.println(response.toString());
				if (response.isSuccessful()) {

					listPost(response.body());
					Toast.makeText(MemoryPostDetailActivity.this, "Successfully got memory post", Toast.LENGTH_SHORT).show();
				}
			}

			@Override
			public void onFailure(Call<MemoryPost> call, Throwable t) {
				Log.d("Error", t.getMessage());
				Toast.makeText(MemoryPostDetailActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
			}
		});
	}
	public void listPost(MemoryPost memoryPost){
		System.out.println("aaaaaaaa");
		RelativeLayout mainLayout = findViewById(R.id.memoryPostDetailActivityLayout);

		ScrollView memoryPostView = new ScrollView(this);
		memoryPostView.setId(View.generateViewId());
		RelativeLayout.LayoutParams paramsMemoryPostView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
		memoryPostView.setPadding(screenWidth/30, screenWidth/30, screenWidth/30, screenWidth/30);
		mainLayout.addView(memoryPostView, paramsMemoryPostView);



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
		paramsTitleTextView.addRule(RelativeLayout.BELOW, memoryPostInfoLayout.getId());
		titleTextView.setId(View.generateViewId());
		memoryPostLayout.addView(titleTextView, paramsTitleTextView);


		int id = titleTextView.getId();

		for (int j=0; j<memoryPost.story.length; j++){
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
				else{
					ImageView storyImageView = new ImageView(this);
					Picasso.get().load(memoryPost.story[j].payload.toString()).into(storyImageView);
					RelativeLayout.LayoutParams paramsStoryImageView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
					paramsStoryImageView.addRule(RelativeLayout.BELOW, id);
					storyImageView.setId(View.generateViewId());
					id = storyImageView.getId();
					memoryPostLayout.addView(storyImageView, paramsStoryImageView);
				}
		}

            /*TextView tagTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsTagTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            tagTextView.setText("Tags: " + memoryPost.tags);
            tagTextView.setTextSize(15);
            paramsTagTextView.addRule(RelativeLayout.BELOW, id);
            tagTextView.setId(View.generateViewId());
            memoryPostLayout.addView(tagTextView, paramsTagTextView);*/

		if (memoryPost.time != null){
			TextView timeTextView = new TextView(this);
			RelativeLayout.LayoutParams paramsTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
			timeTextView.setText(memoryPost.time.toString());
			timeTextView.setTextSize(25);
			paramsTimeTextView.addRule(RelativeLayout.BELOW, id);
			timeTextView.setId(View.generateViewId());
			id = timeTextView.getId();
			memoryPostLayout.addView(timeTextView, paramsTimeTextView);
		}


           /* TextView locationTextView = new TextView(this);
            RelativeLayout.LayoutParams paramsLocationTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            locationTextView.setText("Locations: " + memoryPost.location);
            locationTextView.setTextSize(15);
            paramsLocationTextView.addRule(RelativeLayout.BELOW, timeTextView.getId());
            locationTextView.setId(View.generateViewId());
            memoryPostLayout.addView(locationTextView, paramsLocationTextView);*/

		MapView map = new MapView(this);
		RelativeLayout.LayoutParams paramsMap = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, screenHeight/2);
		paramsMap.addRule(RelativeLayout.BELOW, id);
		map.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
		map.setId(View.generateViewId());
		memoryPostLayout.addView(map , paramsMap);

		MapFragment mMapFragment = MapFragment.newInstance();
		FragmentTransaction fragmentTransaction =
				getFragmentManager().beginTransaction();
		fragmentTransaction.add(map.getId(), mMapFragment);
		fragmentTransaction.commit();

	}

	void getScreenSize() {
		android.view.Display display = getWindowManager().getDefaultDisplay();
		android.graphics.Point size = new android.graphics.Point();
		display.getSize(size);
		screenWidth = size.x;
		screenHeight = size.y;
	}

}
