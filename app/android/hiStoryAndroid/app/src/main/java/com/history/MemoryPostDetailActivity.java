package com.history;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MemoryPostDetailActivity extends AppCompatActivity {
	String SERVER_URL = "https://history-backend.herokuapp.com";
	int memoryPostId;
	String authToken;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_memory_post_detail);
		getSupportActionBar().hide();

		Bundle extras = getIntent().getExtras();
		memoryPostId = (int) extras.get("memoryPostId");
		authToken = (String) extras.get("authToken");

		getMemoryPost();

	}
	public void getMemoryPost(){
		/*Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

		ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

		final Call<MemoryPost> call = apiEndpoints.getMemoryPost(authToken);



		call.enqueue(new Callback<MemoryPostPage>() {
			@Override
			public void onResponse(Call<MemoryPost> call, Response<MemoryPostPage> response) {
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
		});*/
	}
}
