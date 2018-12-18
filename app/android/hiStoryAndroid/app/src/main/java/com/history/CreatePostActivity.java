package com.history;


import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import org.apache.commons.io.FileUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CreatePostActivity extends AppCompatActivity {

    String SERVER_URL = "https://history-backend.herokuapp.com";

    String day_;
    String month_;
    String year_;
    String auth_token;
    boolean waitingResponse = false;
    private static final int SELECT_PICTURE = 1;
    private static final int SELECT_VIDEO = 2;

    String filename = "aaa";
    ArrayList storyElements;
    ArrayList tags;
    int lastStoryElementId;
    RelativeLayout storyComponentsLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        setContentView(R.layout.activity_create_post);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);

        checkUserData();
        lastStoryElementId = R.id.addTitleEditText;
        storyComponentsLayout = findViewById(R.id.components);
        storyElements = new ArrayList();
        tags = new ArrayList();
    }



    public void checkUserData(){
        SharedPreferences prefs = getSharedPreferences("userInfo", MODE_PRIVATE);
        auth_token = prefs.getString("authToken", "");
    }


    public void showDatePicker(View v) {
        DialogFragment newFragment = new MyDatePickerFragment();
        newFragment.show(getSupportFragmentManager(), "date picker");

    }

    public void addTag(View view){
        EditText tagEditText = findViewById(R.id.addTagEditText);
        tags.add(tagEditText.getText().toString());
        tagEditText.setText("");
    }

    public void createPost(View view) throws Exception{

        if (!waitingResponse){
            waitingResponse = true;


            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            // set your desired log level
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
           
            httpClient.addInterceptor(logging);


            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(SERVER_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(httpClient.build())
                    .build();


            ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

            String newTitle = ((EditText)findViewById(R.id.addTitleEditText)).getText().toString();



            String exampleTitle = newTitle;
            //String exampleTime = "{\"type\": \"duration\", \"data\": [\"1980\", \"1990\"]}";
            String exampleTime2 = "{\"type\": \"certainTime\", \"data\": [\""+ day_ +"\", \""+ month_ +"\", \""+year_+"\"]}";

            String exampleLocation = "[{\"type\": \"region\", \"name\": \" "+ "Istanbul" +"\"}]";

            String tagString = "[";
            for (int i=0; i<tags.size(); i++){
                tagString += "\"" + tags.get(i) + "\"";
                if (i<tags.size() -1) tagString += ", ";
            }
            tagString += "]";
            System.out.println("Tag String: " + tagString);



            RequestBody title = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleTitle);

            RequestBody time = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleTime2);

            RequestBody location = RequestBody.create(
                    okhttp3.MultipartBody.FORM, exampleLocation);

            RequestBody tag = RequestBody.create(okhttp3.MultipartBody.FORM, tagString);
             List<MultipartBody.Part> story = new ArrayList<>();

             for (int i=0; i<storyElements.size(); i++){
                 if (storyElements.get(i).getClass() == EditText.class){
                     EditText storyElement = (EditText) storyElements.get(i);
                     MultipartBody.Part storyBody = MultipartBody.Part.createFormData( "story[" + i + "]",  storyElement.getText().toString());
                     story.add(storyBody);
                 }
             }

            for (int i=0; i<storyElements.size(); i++){
                if(storyElements.get(i).getClass() == File.class){

                    File file = ((File) storyElements.get(i));
                    System.out.println("File: " + file.getAbsolutePath() + " " + file.getCanonicalPath() + " " + file.getName() + " length: " + file.length());
                    RequestBody requestFile = RequestBody.create(MediaType.parse("image/png"), file);
                    MultipartBody.Part image = MultipartBody.Part.createFormData("story[" + i
                            +"]", "" + i,requestFile);
                    story.add(image);
                }
            }

             final Call<ResponseBody> call = apiEndpoints.uploadMultipleFiles("Token " + auth_token, title,time,location,tag,story);
      
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    Toast.makeText(CreatePostActivity.this, "Response???", Toast.LENGTH_SHORT).show();
                    if (response.isSuccessful()) {
                        //Log.d("Success" , String.valueOf(response.body().title));
                        Toast.makeText(CreatePostActivity.this, "Post Created", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                        backToHomePage(null);

                    } else {
                        System.out.println("Failure: " + response.toString());
                        Toast.makeText(CreatePostActivity.this, "Could not create post.", Toast.LENGTH_SHORT).show();
                        waitingResponse = false;
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    t.printStackTrace();
                    Toast.makeText(CreatePostActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                    waitingResponse = false;
                }

            });

        }
        else {
            Toast.makeText(CreatePostActivity.this, "Waiting Response to Previous Request", Toast.LENGTH_SHORT).show();

        }

    }

    public void create(View view) throws Exception{
        createPost(null);
    }



    public void backToHomePage(View view){
        Intent intent = new Intent(this, HomePageActivity.class);
        startActivity(intent);
        finish();
    }

    public void selectImage(View view){
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent,
                "Select Picture"), SELECT_PICTURE);
    }

    public void selectVideo(View view){
        Intent intent = new Intent(Intent.ACTION_PICK);
        intent.setType("video/*");

        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Video"), SELECT_VIDEO);
    }
    public void addEditText(View view){
        if (storyElements.size() == 0){
            TextView defaultStoryTextView = findViewById(R.id.defaultPostStory);
            storyComponentsLayout.removeView(defaultStoryTextView);
        }
        else if(!storyElements.get(storyElements.size()-1).getClass().equals(EditText.class))  {
            EditText editText = new EditText(this);
            storyElements.add(editText);
        }

        EditText editText = new EditText(this);
        editText.setHint("Write something...");
        editText.setPadding(20,20,20,20);
        RelativeLayout.LayoutParams paramsEditText = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        paramsEditText.addRule(RelativeLayout.BELOW, lastStoryElementId);
        editText.setId(View.generateViewId());
        lastStoryElementId = editText.getId();
        storyComponentsLayout.addView(editText, paramsEditText);
        storyElements.add(editText);
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data){
        if (resultCode == RESULT_OK) {
            if (requestCode == SELECT_PICTURE) {
                Uri imageUri = data.getData();
                if (imageUri != null){
                    try { addImage(imageUri); }
                    catch (Exception e){ }
                }
            }
            else if(requestCode == SELECT_VIDEO){
                System.out.println(data.getData().toString());
                Uri videoUri = data.getData();
                System.out.println("Video uri: " + videoUri.toString());
                if (videoUri != null){
                    try{
                        addVideo(videoUri);
                    }catch(Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }
    }
    public void addVideo(Uri videoUri){
        if (storyElements.size() == 0){
            TextView defaultStoryTextView = findViewById(R.id.defaultPostStory);
            storyComponentsLayout.removeView(defaultStoryTextView);
        }
        RelativeLayout videoLayout = new RelativeLayout(this);
        RelativeLayout.LayoutParams paramsVideoLayout = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, 500);
        paramsVideoLayout.addRule(RelativeLayout.BELOW, lastStoryElementId);
        videoLayout.setId(View.generateViewId());
        lastStoryElementId = videoLayout.getId();
        storyComponentsLayout.addView(videoLayout, paramsVideoLayout);



        final VideoView videoView = new VideoView(this);
        videoView.setVideoURI(videoUri);
        RelativeLayout.LayoutParams paramsVideoView = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        videoLayout.addView(videoView, paramsVideoView);
        videoView.seekTo( 1 );

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
    public void addImage(Uri imageUri) throws Exception{
        if (storyElements.size() == 0){
            TextView defaultStoryTextView = findViewById(R.id.defaultPostStory);
            storyComponentsLayout.removeView(defaultStoryTextView);
        }
        ImageView imageView = new ImageView(this);
        imageView.setImageURI(imageUri);
        RelativeLayout.LayoutParams paramsImageView = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        paramsImageView.addRule(RelativeLayout.BELOW, lastStoryElementId);
        imageView.setId(View.generateViewId());
        lastStoryElementId = imageView.getId();
        storyComponentsLayout.addView(imageView, paramsImageView);


        Bitmap bitmap = ((BitmapDrawable)imageView.getDrawable()).getBitmap();
        File f = new File(this.getCacheDir(), "" + (storyElements.size() + 1));
        f.createNewFile();

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 0, bos);
        byte[] bitmapdata = bos.toByteArray();

        FileOutputStream fos = new FileOutputStream(f);
        fos.write(bitmapdata);
        fos.flush();
        fos.close();

        storyElements.add(f);
    }



    public String getRealPathFromURI(Uri contentUri) {

        // can post image
        String [] proj={MediaStore.Images.Media.DATA};
        Cursor cursor = getContentResolver().query(contentUri,
                proj, // Which columns to return
                null,       // WHERE clause; which rows to return (all rows)
                null,       // WHERE clause selection arguments (none)
                null); // Order-by clause (ascending by name)
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();

        return cursor.getString(column_index);
    }

    public void pickPresiceDate(View view) {
        DateDialogFragment newFragment = new DateDialogFragment();
        newFragment.show(getSupportFragmentManager(), "missiles");
    }

}