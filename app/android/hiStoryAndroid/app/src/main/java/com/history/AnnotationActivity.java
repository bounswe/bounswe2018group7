package com.history;

import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AnnotationActivity extends AppCompatActivity {
    String SERVER_URL = "https://history-backend.herokuapp.com";
    ScrollView mainLayout;
    RelativeLayout scrollLayout;
    boolean type;
    String text;
    String url;
    String authToken;
    TextView annotation;
    EditText editText;
    boolean chosenAnnotationType = false;
    boolean waiting = false;
    int id = 0;
    TextView textView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_annotation);
        getSupportActionBar().hide();
        mainLayout = findViewById(R.id.annotationActivityMainLayout);
        scrollLayout = new RelativeLayout(this);
        mainLayout.addView(scrollLayout);

        annotation = new TextView(this);
        annotation.setText("ANNOTATION");
        annotation.setTextSize(30);
        annotation.setGravity(Gravity.CENTER);
        RelativeLayout.LayoutParams paramsAnnotation = new RelativeLayout.LayoutParams
                (RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        annotation.setId(View.generateViewId());
        scrollLayout.addView(annotation , paramsAnnotation);

        Bundle extras = getIntent().getExtras();
        type = extras.getBoolean("type");
        url = extras.getString("url");
        authToken = extras.getString("authToken");
        if (type){
            text = extras.getString("text");
            addText();
        }
        else{
            addImage();
        }
    }
    public void addText(){
        textView = new TextView(this);
        textView.setTextIsSelectable(true);
        textView.setText( text );
        textView.setTextSize(20);
        RelativeLayout.LayoutParams paramsTextView = new RelativeLayout.LayoutParams
                (RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        paramsTextView.addRule(RelativeLayout.BELOW, annotation.getId());
        paramsTextView.topMargin = 10;
        textView.setId(View.generateViewId());
        scrollLayout.addView(textView, paramsTextView);

        Button addTextAnnotation = new Button(this);
        addTextAnnotation.setText("TEXT ANNOTATION");
        addTextAnnotation.setTextSize(20);
        addTextAnnotation.setId(View.generateViewId());
        id = addTextAnnotation.getId();
        RelativeLayout.LayoutParams paramsAddTextAnnotation = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT) ;
        paramsAddTextAnnotation.addRule(RelativeLayout.BELOW , textView.getId());
        paramsAddTextAnnotation.topMargin = 30;
        paramsAddTextAnnotation.leftMargin = 30;
        scrollLayout.addView(addTextAnnotation, paramsAddTextAnnotation);
        addTextAnnotation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!chosenAnnotationType) addTextAnnotation();
            }
        });

        Button addImageAnnotation = new Button(this);
        addImageAnnotation.setText("Image ANNOTATION");
        addImageAnnotation.setTextSize(20);
        RelativeLayout.LayoutParams paramsAddImageAnnotation = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT) ;
        paramsAddImageAnnotation.addRule(RelativeLayout.BELOW , textView.getId());
        paramsAddImageAnnotation.addRule(RelativeLayout.RIGHT_OF, addTextAnnotation.getId());
        paramsAddImageAnnotation.topMargin = 30;
        paramsAddImageAnnotation.leftMargin = 30;
        scrollLayout.addView(addImageAnnotation, paramsAddImageAnnotation);
    }
    public void addImage(){
        chosenAnnotationType = true;
    }
    public void addTextAnnotation(){
        chosenAnnotationType = true;
        editText = new EditText(this);
        editText.setHint("Annotation Text...");
        editText.setPadding(20,20,20,20);
        RelativeLayout.LayoutParams paramsEditText = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        paramsEditText.addRule(RelativeLayout.BELOW, id);
        editText.setId(View.generateViewId());
        id = editText.getId();
        scrollLayout.addView(editText, paramsEditText);

        Button saveAnnotation = new Button(this);
        saveAnnotation.setText("Save Annotation");
        saveAnnotation.setTextSize(20);
        saveAnnotation.setGravity(Gravity.CENTER);
        saveAnnotation.setId(View.generateViewId());
        RelativeLayout.LayoutParams paramsSaveAnnotation = new RelativeLayout.LayoutParams
                (RelativeLayout.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT) ;
        paramsSaveAnnotation.addRule(RelativeLayout.BELOW , editText.getId());
        paramsSaveAnnotation.topMargin = 30;
        scrollLayout.addView(saveAnnotation, paramsSaveAnnotation);
        saveAnnotation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!waiting){
                    waiting = true;
                    sendTextToTextAnnotation();
                }
            }
        });
    }
    public void sendTextToTextAnnotation(){
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        // set your desired log level
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

        httpClient.addInterceptor(logging);

        Retrofit retrofit = new Retrofit.Builder().baseUrl(SERVER_URL).addConverterFactory
                (GsonConverterFactory.create()).client(httpClient.build()).build();

        ApiEndpoints apiEndpoints = retrofit.create(ApiEndpoints.class);

        AnnotationBody body = new AnnotationBody();
        body.type = "TextualBody";
        body.value = editText.getText().toString();

        AnnotationTarget target = new AnnotationTarget();
        target.source = url;
        AnnotationSelector selector = new AnnotationSelector();
        selector.type = "TextQuoteSelector";
        selector.exact = textView.getText().subSequence(textView.getSelectionStart(), textView.getSelectionEnd()).toString();
        selector.prefix = textView.getText().subSequence(0, textView.getSelectionStart()).toString();
        selector.suffix = textView.getText().subSequence(textView.getSelectionEnd(), textView.getText().length()).toString();
        target.selector = selector;

        Annotation annotation = new Annotation();
        annotation.body = body;
        annotation.target = target;

        final Call<Object> call = apiEndpoints.sendAnnotation("Token " + authToken, annotation);
        call.enqueue(new Callback<Object>() {
            @Override
            public void onResponse(Call<Object> call, Response<Object> response) {
                Toast.makeText(AnnotationActivity.this, "Successfully sent annotation", Toast
                        .LENGTH_SHORT).show();
                finish();
               System.out.println(response.body());
            }

            @Override
            public void onFailure(Call<Object> call, Throwable t) {
                Log.d("Error", t.getMessage());
                Toast.makeText(AnnotationActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
