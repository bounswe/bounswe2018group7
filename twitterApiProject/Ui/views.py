from django.shortcuts import render
from django.http import HttpResponseRedirect

import requests
import json


def getUrlsUi(request):
    response = requests.get("http://127.0.0.1:8000/api/memory_posts/geturl.json")
    response_data = response.json()
    return render(request, 'Ui/geturl.html',
                  {'all': response_data})


def list_tweets(request):

    response = requests.get("http://127.0.0.1:8000/api/memory_posts/all.json")
    response_data = response.json()

    return render(request, 'Ui/list_tweets.html', {'tweets': response_data})
