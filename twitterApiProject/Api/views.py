from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class memoryPosts(APIView):
	def get(self, request):
		params = request.query_params
		type = params['type']
		if type == 'all':
			return self.all_posts()
		elif type == 'search':
			return self.search_posts(params)
		else:
			pass # ERROR

	def search_posts(self, params):
		# Handle searching for specific Tweets here.
		result = {'test_entry': 'searching_tweets'}	# Populate this
		return Response(result)

	def all_posts(self):
		# Handle retrieving all the Tweets here.
		result = {'test_entry': 'all_tweets'}	# Populate this
		return Response(result)

	def post(self, request):
		# Handle creating a new Tweet here.
		result = {'test_entry': 'creating_tweets'}	# Populate this
		return Response(result)
