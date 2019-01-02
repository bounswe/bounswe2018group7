package com.history;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class ProfilePageActivity extends AppCompatActivity {
    String username;
    String authToken;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_page);

        Bundle extras = getIntent().getExtras();
        username = (String) extras.get("username");
        authToken = (String) extras.get("authToken");
    }
}
