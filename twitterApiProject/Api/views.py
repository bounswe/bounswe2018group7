from django.shortcuts import render

from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Api.functions.createMemoryPost import createMemoryPostTweet
from Api.functions.retrieveAllTweets import retrieveAllTweets
from Api.functions.searchTweets import searchTweets
from Api.functions.getTweetIncludeUrls import getTweetIncludeUrls


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



class getOnlyUrlsTweet(APIView):
    def get(self, request):
        '''
		Send a GET request to '/api/memory_posts/geturl.json/'.
		Response:
		A LIST object in the following form:
		[<tweet_text>, <tweet_text>, ...]

		'''
        result = getTweetIncludeUrls()
        return Response(result)
