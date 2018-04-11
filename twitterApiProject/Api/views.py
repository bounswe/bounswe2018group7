from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Api.functions.createMemoryPost import createTweet

class createMemoryPost(APIView):
	def post(self, request):
		# Handle creating a new Tweet here.
		result = createTweet();
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
