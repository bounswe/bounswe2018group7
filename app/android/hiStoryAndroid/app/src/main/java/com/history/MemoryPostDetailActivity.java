package com.history;

import android.app.FragmentTransaction;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Path;
import android.graphics.drawable.GradientDrawable;
import android.location.Address;
import android.location.Geocoder;
import android.os.Handler;
import android.os.Looper;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

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
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.DirectionsApi;
import com.google.maps.DirectionsApiRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsRoute;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MemoryPostDetailActivity extends AppCompatActivity implements OnMapReadyCallback,
		GoogleMap.OnMarkerClickListener {
	String SERVER_URL = "https://history-backend.herokuapp.com";
	int memoryPostId;
	String authToken;
	int screenWidth = 720, screenHeight = 1440;
	GoogleMap googleMap;
	Retrofit retrofit;
	ApiEndpoints apiEndpoints;
	int firstCommentId;
	RelativeLayout commentSectionBody;
	int likeCount = 0, dislikeCount = 0;
	Boolean currentUserLiked = null;
	MemoryPost memoryPost;
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

		getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN|WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

		commentSectionBody = findViewById(R.id.commentSectionBody);

	}

	public void commentSend(View view){
		EditText editText = findViewById(R.id.commentSectionTitle);
		createComment(editText.getText().toString());
		editText.setText("");
	}
	public void getMemoryPost(){
		retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

		apiEndpoints = retrofit.create(ApiEndpoints.class);

		System.out.println("Auth Token : " + authToken);
		final Call<MemoryPost> call = apiEndpoints.getMemoryPost("Token " + authToken , Integer.toString(memoryPostId));


		call.enqueue(new Callback<MemoryPost>() {
			@Override
			public void onResponse(Call<MemoryPost> call, Response<MemoryPost> response) {
				if (response.isSuccessful()) {
					memoryPost = response.body();
					try {
						listPost();
					}
					catch (Exception e){

					}
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

		firstCommentId = R.id.firstComment;
		final Call<ArrayList<Comment>> commentsCall = apiEndpoints.getCommentsForMemoryPost
				("Token " + authToken, Integer.toString
						(memoryPostId));
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
			addComment(comment);
		}
	}
	public void addComment(Comment comment){
		System.out.println("Content: " + comment.content + " Username: " + comment.username + " MemoryPost: " + comment.memoryPost + " Id: " + comment.id + " Created: " + comment.created);
		TextView commentTextView = new TextView(this);
		RelativeLayout.LayoutParams paramsComment = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
		commentTextView.setText(comment.username + ": " + comment.content);
		commentTextView.setTextSize(20);
		paramsComment.addRule(RelativeLayout.BELOW, firstCommentId);
		commentTextView.setId(View.generateViewId());
		firstCommentId = commentTextView.getId();
		commentSectionBody.addView(commentTextView, paramsComment);
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

		if (comment.length() != 0){
			Comment c = new Comment();
			c.content = comment;
			c.memoryPost = memoryPostId;

			final Call<Comment> call = apiEndpoints.createComment("Token " + authToken, c);
			call.enqueue(new Callback<Comment>() {
				@Override
				public void onResponse(Call<Comment> call, Response<Comment> response) {
					if (response.isSuccessful()) {
						System.out.println("Success");
						addComment(response.body());

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
	}
	public void listPost() throws Exception{
		RelativeLayout showPost = findViewById(R.id.showPost);

		RelativeLayout memoryPostLayout = findViewById(R.id.showPostBody);

		ImageView profilePicture = findViewById(R.id.iconImageView);

		RelativeLayout infoLayout = findViewById(R.id.navigationBarActivityMemoryPost);
		infoLayout.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(MemoryPostDetailActivity.this, ProfilePageActivity.class);
				intent.putExtra("username", memoryPost.username);
				intent.putExtra("authToken", authToken);
				startActivity(intent);
			}
		});

		TextView authorTextView = findViewById(R.id.showUsernameTextView);
		authorTextView.setText(memoryPost.username);

		TextView createdTimeTextView = findViewById(R.id.showCreatedDateTextView);
		createdTimeTextView.setText(memoryPost.created);

		TextView titleTextView = findViewById(R.id.showTitleTextView);
		titleTextView.setText(memoryPost.title);

		TextView timeTextView = findViewById(R.id.showTimeTextView);

		int id = titleTextView.getId();

		if (memoryPost.time != null){
			if (memoryPost.time.type.equals("certain")){
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
				Date parsedDate = sdf.parse(((String) memoryPost.time.data));
				String time = new SimpleDateFormat("EEEE, MMM dd yyyy, HH:mm").format(parsedDate);
				timeTextView.setText(time);
			}
			else if(memoryPost.time.type.equals("duration")){
				ArrayList list = (ArrayList) memoryPost.time.data;
				timeTextView.setText((String) list.get(0).toString());
			}
			else if(memoryPost.time.type.equals("general")){
				timeTextView.setText(memoryPost.time.data.toString());
			}
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
				storyTextView.setText("\n" + memoryPost.story[j].payload.toString());
				storyTextView.setTextSize(20);
				paramsStoryTextView.addRule(RelativeLayout.BELOW, id);
				storyTextView.setId(View.generateViewId());
				memoryPostLayout.addView(storyTextView, paramsStoryTextView);

				TextView annotate = new TextView(this);
				annotate.setText("Annotate");
				annotate.setTextColor(Color.RED);
				RelativeLayout.LayoutParams paramsAnnotate = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
				annotate.setTextSize(20);
				paramsAnnotate.addRule(RelativeLayout.BELOW, id);
				id = storyTextView.getId();
				memoryPostLayout.addView(annotate, paramsAnnotate);
			}
			else if(memoryPost.story[j].type.contains("image")){
				ImageView storyImageView = new ImageView(this);
				Picasso.get().load(memoryPost.story[j].payload.toString()).into(storyImageView);
				RelativeLayout.LayoutParams paramsStoryImageView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
				paramsStoryImageView.addRule(RelativeLayout.BELOW, id);
				storyImageView.setId(View.generateViewId());
				memoryPostLayout.addView(storyImageView, paramsStoryImageView);

				TextView annotate = new TextView(this);
				annotate.setText("Annotate");
				annotate.setTextColor(Color.RED);
				RelativeLayout.LayoutParams paramsAnnotate = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
				annotate.setTextSize(20);
				paramsAnnotate.addRule(RelativeLayout.BELOW, id);
				id = storyImageView.getId();
				memoryPostLayout.addView(annotate, paramsAnnotate);
			}
			else if(memoryPost.story[j].type.contains("video")){

				RelativeLayout videoLayout = new RelativeLayout(this);
				RelativeLayout.LayoutParams paramsVideoLayout = new RelativeLayout
						.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, screenHeight/5);
				paramsVideoLayout.addRule(RelativeLayout.BELOW, id);
				paramsVideoLayout.addRule(RelativeLayout.CENTER_HORIZONTAL);
				videoLayout.setId(View.generateViewId());
				id = videoLayout.getId();
				memoryPostLayout.addView(videoLayout, paramsVideoLayout);


				final VideoView videoView = new VideoView(this);
				videoView.setVideoPath(((String) memoryPost.story[j].payload));
				RelativeLayout.LayoutParams paramsVideoView = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
				paramsVideoView.addRule(RelativeLayout.CENTER_HORIZONTAL);
				videoLayout.addView(videoView, paramsVideoView);
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


		Reactions reactions = memoryPost.reactions;

		System.out.println("Reactions: " + reactions.toString());
		if (reactions.current_user_liked == null){
			System.out.println("Current user liked: null");
		}
		else if(reactions.current_user_liked){
			System.out.println("Current user liked: true");
			like();
		}
		else{
			System.out.println("Current user liked: false");
			dislike();
		}
		if (reactions.like != 0){
			Button likeButton = findViewById(R.id.likeButton);
			likeButton.setText("LIKE: " + reactions.like);
		}
		if (reactions.dislike != 0){
			Button dislikeButton = findViewById(R.id.dislikeButton);
			dislikeButton.setText("DISLIKE: " + reactions.dislike);
		}
		likeCount = reactions.like;
		dislikeCount = reactions.dislike;
		System.out.println("Like: " + reactions.like + " Dislike: " + reactions.dislike);

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




		if (memoryPost.location.length > 0){
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
		}
		TextView tagTextView = new TextView(this);
		RelativeLayout.LayoutParams paramsTagTextView = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
		if (memoryPost.tags != null){
			tagTextView.setText("Tags: ");
			for (int i=0; i<((ArrayList)memoryPost.tags).size(); i++){
				tagTextView.setText(tagTextView.getText() + " #" + ((ArrayList)memoryPost.tags).get(i));
			}
		}
		tagTextView.setTextSize(25);
		paramsTagTextView.addRule(RelativeLayout.BELOW, id);
		tagTextView.setId(View.generateViewId());
		memoryPostLayout.addView(tagTextView, paramsTagTextView);

	}

	@Override
	public void onMapReady(final GoogleMap googleMap) {
		this.googleMap = googleMap;
		final GeoApiContext context = new GeoApiContext();
		context.setApiKey("AIzaSyCL5j3Ggh6q_OEdf8uEC4FY1B0YzeKICqM");

		for (int i=0; i<memoryPost.location.length; i++){
			MemoryPostLocation loc = memoryPost.location[i];
			if (loc.type.equals("path")){
				double lat = ((double) ((Map) loc.points.get(0)).get("lat1"));
				double lng = ((double) ((Map) loc.points.get(0)).get("lng1"));
				final String latlng = lat + "," + lng;
				double lat2 = ((double) ((Map) loc.points.get(1)).get("lat2"));
				double lng2 = ((double) ((Map) loc.points.get(1)).get("lng2"));
				final String latlng2 = lat2 + "," + lng2;

				Thread thread = new Thread(new Runnable() {

					@Override
					public void run() {
						try {
							final DirectionsRoute route[] = DirectionsApi.newRequest(context).origin
									(latlng).destination(latlng2).await();

							new Handler(Looper.getMainLooper()).post(new Runnable() {
								@Override
								public void run() {
									List<com.google.maps.model.LatLng> list = route[0].overviewPolyline.decodePath();
									PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
									for (int z = 0; z < list.size(); z++) {
										com.google.maps.model.LatLng point = list.get(z);
										LatLng point2 = new LatLng(point.lat, point.lng);
										options.add(point2);
										if((z==0) || (z== list.size() -1)) googleMap.addMarker(new
												MarkerOptions()
												.position
												(point2));
										googleMap.moveCamera( CameraUpdateFactory.newLatLngZoom(point2,
												13.0f) );
									}
									googleMap.addPolyline(options);
								}
							});
						}
						catch (Exception e){
							System.out.println("Error: ");
							e.printStackTrace();
						}
					}
				});

				thread.start();
			}
			else if(loc.type.equals("area")){
				PolylineOptions options = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
				LatLng latlng = null;
				for (int z = 0; z < loc.points.size() + 1; z++){
					latlng = new LatLng(((double) ((Map) loc.points.get(z%loc.points.size())).get
							("lat")), (
							(double) ((Map) loc.points.get(z%loc.points.size())).get("lng")));
					options.add(latlng);
					googleMap.addMarker(new MarkerOptions().position(latlng));
				}
				googleMap.addPolyline(options);
				googleMap.moveCamera( CameraUpdateFactory.newLatLngZoom(latlng, 12.0f) );
			}
			else if (loc.type.equals("certain")){
				double lat = ((double) ((Map) loc.points.get(0)).get("lat1"));
				double lng = ((double) ((Map) loc.points.get(0)).get("lng1"));
				LatLng latlng = new LatLng(lat, lng);
				googleMap.addMarker(new MarkerOptions().position(latlng));
				googleMap.moveCamera( CameraUpdateFactory.newLatLngZoom(latlng, 12.0f) );
				googleMap.setOnMarkerClickListener(this);
			}
		}
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

	public void like(View view){
		if (currentUserLiked == null){
			Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

			ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

			Reaction reaction = new Reaction(memoryPostId, true);

			final Call<Reaction> call = apiEndpoints.postReaction("Token " + authToken, reaction);
			call.enqueue(new Callback<Reaction>() {
				@Override
				public void onResponse(Call<Reaction> call, Response<Reaction> response) {
					if (response.isSuccessful()) {
						System.out.println("Liked successfully");
						likeCount++;
						Button likeButton = findViewById(R.id.likeButton);
						likeButton.setText("LIKE: " + likeCount);
						like();
					} else {
						Log.d("Failure", response.toString());
					}
				}

				@Override
				public void onFailure(Call<Reaction> call, Throwable t) {
					Log.d("Error", t.getMessage());
					Toast.makeText(MemoryPostDetailActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT)
							.show();
				}
			});
		}
		else {
		}
	}
	public void like(){
		currentUserLiked = true;
		Button likeButton = findViewById(R.id.likeButton);
		likeButton.setBackgroundResource(R.color.colorPrimary);
	}
	public void dislike(){
		currentUserLiked = false;
		Button dislikeButton = findViewById(R.id.dislikeButton);
		dislikeButton.setBackgroundResource(R.color.colorPrimary);
	}
	public void dislike(View view){
		if (currentUserLiked == null){
			Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

			ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

			Reaction reaction = new Reaction(memoryPostId, false);

			final Call<Reaction> call = apiEndpoints.postReaction("Token " + authToken, reaction);
			call.enqueue(new Callback<Reaction>() {
				@Override
				public void onResponse(Call<Reaction> call, Response<Reaction> response) {
					if (response.isSuccessful()) {
						System.out.println("Disliked successfully");
						dislikeCount++;
						Button dislikeButton = findViewById(R.id.dislikeButton);
						dislikeButton.setText("DISLIKE: " + dislikeCount);
						dislike();
					} else {
						Log.d("Failure", response.toString());
					}
				}

				@Override
				public void onFailure(Call<Reaction> call, Throwable t) {
					Log.d("Error", t.getMessage());
					Toast.makeText(MemoryPostDetailActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT)
							.show();
				}
			});
		}
		else {
		}
	}

}
