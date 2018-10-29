package com.history;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RegisterActivity extends AppCompatActivity {

    String SERVER_URL = "https://history-backend.herokuapp.com";

    boolean waitingResponse = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_register);
    }

    public void register(View view){

        if (!waitingResponse){
            waitingResponse = true;
            Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory(GsonConverterFactory.create()).build();

            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

            String firstName = ((EditText)findViewById(R.id.getFirstNameEditText)).getText().toString();
            String lastName = ((EditText)findViewById(R.id.getLastNameEditText)).getText().toString();
            String username = ((EditText)findViewById(R.id.getUsernameEditText)).getText().toString();
            String email = ((EditText)findViewById(R.id.getEmailEditText)).getText().toString();
            String password = ((EditText)findViewById(R.id.getPasswordEditText)).getText().toString();
            String passwordConfirmation = ((EditText)findViewById(R.id.getPasswordConfirmationEditText)).getText().toString();


            User user = new User(username, email, password, passwordConfirmation, firstName, lastName);

            final Call<User> call = apiEndpoints.signUp(user);
            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful()) {
                        Log.d("Success" , String.valueOf(response.body().username));
                        Toast.makeText(RegisterActivity.this, "Hello " + response.body().first_name +
                                "\nYour account has been created. \nPlease confirm email and Login.", Toast.LENGTH_SHORT).show();
                        signUp(response.body());

                    } else {
                        Log.d("Failure", response.toString());
                        Toast.makeText(RegisterActivity.this, "Authentication Failed\n" + response.errorBody().source(), Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    Log.d("Error", t.getMessage());
                    Toast.makeText(RegisterActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    waitingResponse = false;
                }
            });
        }
        else {
            Toast.makeText(RegisterActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();
        }

    }

    public void signUp(User user){
        saveUser(user);
        openLoginActivity(null);
    }

    public void saveUser(User user){
        SharedPreferences.Editor editor = getSharedPreferences("sharedPreferences", MODE_PRIVATE).edit();
        editor.putString("username", user.username);
        // password someday?
        editor.apply();
        System.out.println(user.username + " " + user.email + " " + user.first_name + " " + user.last_name + " " + user.admin + " " + user.confirmed + " " + user.banned + " " + user.auth_token);
    }

    public void openLoginActivity(View view){
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }

}
