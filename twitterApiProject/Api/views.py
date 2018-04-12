from django.shortcuts import render
from  .models import *
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.generic import CreateView,ListView, DetailView,DeleteView,View

from Api.functions.createMemoryPost import createMemoryPostTweet
from Api.functions.getTweetIncludeUrls import getTweetIncludeUrls
from django.core.urlresolvers import reverse_lazy, reverse
from .forms import *
from .models import *

#
# def post_new(request):
#     if request.method == "POST":
#         form = PostForm(request.POST)
#         if form.is_valid():
#             post = form.save(commit=False)
#             post.author = request.user
#             post.published_date = timezone.now()
#             post.save()
#             return redirect('post_detail', pk=post.pk)
#     else:
#         form = PostForm()
#     return render(request, 'blog/post_edit.html', {'form': form})
#

class createMemoryPost(APIView):
    template_name = 'Ui/create.html'
    form = CreateTweet()

    def post(self, request):


        result = createMemoryPostTweet(request.data)
        # return Response(result)

        return render(request, self.template_name,{'result':result})

    # def post(self, request):
    #
    #     # result = createMemoryPostTweet(request.data)
    #     # return Response(result)
    #
    #     return render(request, self.template_name, {'form': self.response})

    def get(self, request):

        return render(request, self.template_name)


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


class findOnlyUrlTweet(APIView):
    template_name = 'Ui/geturl.html'

    def get(self, request):
        result = getTweetIncludeUrls()
        # import tweepy
        # # set up the consumer key and access token (obtained from https://apps.twitter.com/app/new)
        # consumer_key = 'T4gX2gnp2hwqO37HqNB9sIO1r'
        # consumer_secret = 'T8bVDSUfRWGYMjDyUFQsXidbyjcwjrAoXdorNVKdqJ5sEtzZDq'
        #
        # access_token = '808709454728495104-gTALsuQHpEP7djuIbFbkFgrjkackuO0'
        # access_token_secret = '9jVOYjzTaIHRYGMOC1ciC4jl1crzzwjWRZPRyF7nuTVOp'
        # #  get authorization from Twitter API using tweepy
        # auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        # auth.set_access_token(access_token, access_token_secret)
        # api = tweepy.API(auth)
        # #  get tweets of theUser
        # theUser = 'history_g7'
        #
        # public_tweets = api.home_timeline()

        # userTweets = tweepy.Cursor(api.user_timeline, id=theUser).items()
        # a = 0
        # allTweet = ""
        # for tweet in public_tweets:
        # 	allTweet += str(tweet.text.encode("utf-8")) + "<br/>"
        # 	a += 1
        # 	if (a == 10):
        # 		break

        # Handle searching tweets here.
        # result = {'test': 'search_tweets'}
        return render(request, self.template_name, {'all': result})


class index(APIView):
    template_name = 'Ui/index.html'

    def get(self, request):
        return render(request, self.template_name)
