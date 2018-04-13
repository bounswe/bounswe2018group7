from django.shortcuts import render
from  .models import *
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.generic import CreateView,ListView, DetailView,DeleteView,View

from Api.functions.createMemoryPost import createMemoryPostTweet

from Api.functions.retrieveAllTweets import retrieveAllTweets
from Api.functions.searchTweets import searchTweets

class createMemoryPost(APIView):
    template_name = 'Ui/create.html'
    form = CreateTweet()

    def post(self, request):


        result = createMemoryPostTweet(request.data)
        # return Response(result)

        return render(request, self.template_name,{'result':result})


    def get(self, request):

        return render(request, self.template_name)


class allMemoryPosts(APIView):

	def get(self, request):
		'''
		Send a GET request to '/api/memory_posts/all.json'.

		Response:
		A JSON object in the following form:
		{ tweet_id: {
					body : full text of the tweet,
					created_at : time the tweet has been created
		}}
		
		'''
		result = retrieveAllTweets()
		return Response(result)


class searchMemoryPosts(APIView):
	def get(self, request):
		"""
			Send a GET request to '/api/memory_posts/search.json'. Request body should contain a JSON object in the form:
			{
			'username': <A String of username>,
			'tags': <A List of Strings representing tags for memory post.>
			}

			Only one field must be included.

			Response:
			A JSON object in the following form:
			{ tweet_id: {
			body : full text of the tweet,
			created_at : time the tweet has been created
			}}

		"""
		result = searchTweets(request.data)
		return Response(result)
