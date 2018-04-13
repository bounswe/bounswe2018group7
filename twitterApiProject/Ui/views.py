from django.shortcuts import render
from django.http import HttpResponseRedirect

import requests
import json


def getUrlsUi(request):
    # If this is a POST request we need to process the form data

    response = requests.get("http://127.0.0.1:8000/api/memory_posts/geturl.json")
    response_data = response.json()
    print(response_data)
    # Create an empty form
    return render(request, 'Ui/geturl.html',
                  {'all': response_data})
