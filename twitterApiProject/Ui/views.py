from django.shortcuts import render
from django.http import HttpResponseRedirect

from .forms import PostCreateForm
import requests
import json

def create_post(request):
    # If this is a POST request we need to process the form data
    if request.method == 'POST':
        # Create a form instance and populate it with data from the request:
        form = PostCreateForm(request.POST)
        # Check whether it's valid:
        if form.is_valid():
            form_data = form.cleaned_data
            form_story = str(form_data['story'])
            form_username = str(form_data['username'])
            form_tags = str(form_data['tags']).split(',')

            api_data = {'story': form_story, 'username': form_username, 'tags': form_tags}

            response = requests.post("http://127.0.0.1:8000/api/memory_posts/create.json", json = api_data)
            response_data = response.json()
            form = PostCreateForm()		# Create an empty form
            return render(request, 'Ui/create_post.html', {'status': response_data['result'], 'message': response_data['message'], 'form': form})

    # If a GET (or any other method) we'll create an empty form
    else:
        form = PostCreateForm()

    return render(request, 'Ui/create_post.html', {'form': form})


def getUrlsUi(request):
    response = requests.get("http://127.0.0.1:8000/api/memory_posts/geturl.json")
    response_data = response.json()
    return render(request, 'Ui/geturl.html',
                  {'all': response_data})


def list_tweets(request):

    response = requests.get("http://127.0.0.1:8000/api/memory_posts/all.json")
    response_data = response.json()

    return render(request, 'Ui/list_tweets.html', {'tweets': response_data})





def search_post(request):
    
    if request.method == 'POST':
        query=request.POST
        body={}
        if 'username' in query:
         username=query['username']
         if( len(username)>0 ):
          body={'username': username} 
        elif 'tags' in query:
         tags=query['tags']
         if( len(tags)>0 ):
          body={'tags': tags } 

        response = requests.get("http://127.0.0.1:8000/api/memory_posts/search.json", json=body)
        response_data = response.json()

        return render(request, 'Ui/search_post.html', {'search': response_data}) 

    else:
      #body={'username': '','tags': '' } 

      response = requests.get("http://127.0.0.1:8000/api/memory_posts/search.json" )
      response_data = response.json()
    
    response_data={'result':None,'data':None,'message':None}
    return render(request, 'Ui/search_post.html', {'search': response_data}) 



def indexView(request):

    return render(request, 'Ui/index.html')
