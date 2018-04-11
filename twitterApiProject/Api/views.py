from django.shortcuts import render

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Api.functions.createMemoryPost import createMemoryPostTweet

class createMemoryPost(APIView):
	def post(self, request):
		""" Send a POST request to '/api/memory_posts/create.json'. Request body should contain a JSON object in the form:
			{
				'story': <A String of memory story>,
				'username': <A String of username>,
				'tags': <A List of Strings representing tags for memory post.>
			}
			
			Only 'tags' field is optional.
		
			RESPONSE:
			A JSON object consisting of two keys only: 'result' and 'message'.
				'result' will be either 'error' or 'success' (String).
				'message' will contain the posted Tweet in case of 'success'.
				'message' will contain a specific error message in case of 'error'.
			
			FOR MORE INFORMATION, see the function 'createMemoryPostTweet' in the file 'Api/functions/createMemoryPost.py'
		"""
		result = createMemoryPostTweet(request.data)
		return Response(result)


class allMemoryPosts(APIView):
	def get(self, request):
		# Handle retrieving all tweets here.
		result = {'test': 'all_tweets'}
		return Response(result)


class searchMemoryPosts(APIView):
	def get(self, request):
		# Handle searching tweets here.
		result = {'test': 'search_tweets'}
		return Response(result)
