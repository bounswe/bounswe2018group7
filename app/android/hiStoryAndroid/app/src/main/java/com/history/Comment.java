package com.history;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class Comment {

	int id;

	@SerializedName("memory_post")
	int memoryPost;

	String username;
	String content;
	String created;
}
