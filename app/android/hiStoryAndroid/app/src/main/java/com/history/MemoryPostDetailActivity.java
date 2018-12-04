package com.history;

import android.app.FragmentTransaction;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.location.Address;
import android.location.Geocoder;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.GroundOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MemoryPostDetailActivity extends AppCompatActivity implements OnMapReadyCallback, GoogleMap.OnMarkerClickListener {
	String SERVER_URL = "https://history-backend.herokuapp.com";
	int memoryPostId;
	String authToken;
	int screenWidth = 720, screenHeight = 1440;
	GoogleMap googleMap;
	Retrofit retrofit;
	ApiEndpoints apiEndpoints;
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

		getComments();


	}
	public void getMemoryPost(){
		retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

		apiEndpoints = retrofit.create(ApiEndpoints.class);

		final Call<MemoryPost> call = apiEndpoints.getMemoryPost("Token " + authToken , Integer.toString(memoryPostId));


		call.enqueue(new Callback<MemoryPost>() {
			@Override
			public void onResponse(Call<MemoryPost> call, Response<MemoryPost> response) {
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
	public void getComments(){

		final Call<ArrayList<Comment>> commentsCall = apiEndpoints.getCommentsForMemoryPost("Token " + authToken, Integer.toString(memoryPostId));
		commentsCall.enqueue(new Callback<ArrayList<Comment>>(){
			@Override
			public void onResponse(Call<ArrayList<Comment>> call, Response<ArrayList<Comment>> response) {
				System.out.println(response.toString());
				if (response.isSuccessful()) {

					addComments(response.body());
					Toast.makeText(MemoryPostDetailActivity.this, "Successfully got comments", Toast.LENGTH_SHORT).show();
				}
			}

			@Override
			public void onFailure(Call<ArrayList<Comment>> call, Throwable t) {
				Log.d("Error", t.getMessage());
				Toast.makeText(MemoryPostDetailActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
			}
		});
	}

	public void addComments(ArrayList<Comment> commentList){
		System.out.println(commentList.size());
		for (int i=0; i<commentList.size(); i++){
			Comment comment = commentList.get(i);
			System.out.println("Content: " + comment.content + " Username: " + comment.username + " MemoryPost: " + comment.memoryPost + " Id: " + comment.id + " Created: " + comment.created);
		}
	}

	public void deleteComment(int commentId){


		final Call<Object> call = apiEndpoints.deleteComment("Token " + authToken, commentId);
		call.enqueue(new Callback<Object>() {
			@Override
			public void onResponse(Call<Object> call, Response<Object> response) {
				if (response.isSuccessful()) {
					System.out.println("Success" + response.toString());
				} else {
					System.out.println("Failure " + response.toString());
				}
			}
			@Override
			public void onFailure(Call<Object> call, Throwable t) {
				System.out.println("Error");
			}
		});
	}
	public void createComment(String comment){

		Comment c = new Comment();
		c.content = comment;
		c.memoryPost = memoryPostId;

		final Call<Comment> call = apiEndpoints.createComment("Token " + authToken, c);
		call.enqueue(new Callback<Comment>() {
			@Override
			public void onResponse(Call<Comment> call, Response<Comment> response) {
				if (response.isSuccessful()) {
					System.out.println("Success");
				} else {
					System.out.println("Failure " + response.toString());
				}
			}

			@Override
			public void onFailure(Call<Comment> call, Throwable t) {
				System.out.println("Error");
			}
		});
	}
	public void listPost(MemoryPost memoryPost){
		RelativeLayout showPost = findViewById(R.id.showPost);

		RelativeLayout memoryPostLayout = findViewById(R.id.showPostBody);

		ImageView profilePicture = findViewById(R.id.iconImageView);

		TextView authorTextView = findViewById(R.id.showUsernameTextView);
		authorTextView.setText(memoryPost.username);

		TextView createdTimeTextView = findViewById(R.id.showCreatedDateTextView);
		createdTimeTextView.setText(memoryPost.created);

		TextView titleTextView = findViewById(R.id.showTitleTextView);
		titleTextView.setText(memoryPost.title);

		TextView timeTextView = findViewById(R.id.showTimeTextView);

		int id = titleTextView.getId();

		if (memoryPost.time != null){
			if (memoryPost.time.data.getClass().equals(String.class)){
				timeTextView.setText(memoryPost.time.data.toString());
			}
			else if (memoryPost.time.data.getClass().equals(ArrayList.class)){
				ArrayList list = (ArrayList) memoryPost.time.data;
				timeTextView.setText((String) list.get(0));
			}
			System.out.println("Data class : " + memoryPost.time.data.getClass());
			timeTextView.setId(View.generateViewId());
			id = timeTextView.getId();
		}
		else{
			showPost.removeView(timeTextView);
		}

		
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

//		if (memoryPost.time != null){
//			TextView timeTextView = new TextView(this);
//			RelativeLayout.LayoutParams paramsTimeTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
//			timeTextView.setText(memoryPost.time.toString());
//			timeTextView.setTextSize(25);
//			paramsTimeTextView.addRule(RelativeLayout.BELOW, id);
//			timeTextView.setId(View.generateViewId());
//			id = timeTextView.getId();
//			memoryPostLayout.addView(timeTextView, paramsTimeTextView);
//		}


		MapView map = new MapView(this);
		RelativeLayout.LayoutParams paramsMap = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, screenHeight/2);
		paramsMap.addRule(RelativeLayout.BELOW, id);
		map.setPadding(screenWidth/60, screenWidth/60, screenWidth/60, screenWidth/60);
		map.setId(View.generateViewId());
		id = map.getId();
		memoryPostLayout.addView(map , paramsMap);


		MapFragment mMapFragment = MapFragment.newInstance();
		FragmentTransaction fragmentTransaction =
				getFragmentManager().beginTransaction();
		fragmentTransaction.add(map.getId(), mMapFragment);
		fragmentTransaction.commit();
		mMapFragment.getMapAsync(this);

/*		EditText editText = new EditText(this);
		RelativeLayout.LayoutParams paramsEditText = new RelativeLayout.LayoutParams(screenWidth/2, ViewGroup.LayoutParams.WRAP_CONTENT);
		editText.setHint("Search");
		editText.setTextSize(25);
		paramsEditText.leftMargin = screenWidth/10;
		paramsEditText.addRule(RelativeLayout.BELOW, id);
		memoryPostLayout.addView(editText, paramsEditText);

		Button search = new Button(this);
		search.setText("Search");
		RelativeLayout.LayoutParams paramsSearch = new RelativeLayout.LayoutParams(screenWidth/4, screenWidth/9);
		paramsSearch.addRule(RelativeLayout.BELOW, id);
		paramsSearch.leftMargin = screenWidth/2;
		memoryPostLayout.addView(search, paramsSearch);
		search.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				if (googleMap != null){

				}
			}
		});
*/
	}

	@Override
	public void onMapReady(GoogleMap googleMap) {
		this.googleMap = googleMap;
		googleMap.addMarker(new MarkerOptions().position(new LatLng(41.0082, 28.9784)).title("Istanbul"));
		googleMap.moveCamera( CameraUpdateFactory.newLatLngZoom(new LatLng(41.0082, 28.9784) , 12.0f) );
		googleMap.setOnMarkerClickListener(this);
	}
	public boolean onMarkerClick(final Marker marker) {
		return false;
	}
	void getScreenSize() {
		android.view.Display display = getWindowManager().getDefaultDisplay();
		android.graphics.Point size = new android.graphics.Point();
		display.getSize(size);
		screenWidth = size.x;
		screenHeight = size.y;
	}

}
