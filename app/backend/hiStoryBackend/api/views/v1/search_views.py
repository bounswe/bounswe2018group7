from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404


from api.helpers import json_response_helpers as jrh
from api.models import User, MemoryPost

import requests
from rest_framework.response import Response


class SearchView(APIView):
    
    def post(self, request):
        text = request.data.get('text')

        mem_list = []
        user_list = []

        for post in MemoryPost.objects.all():
            if text in post.title:
                if post.id not in mem_list:
                    mem_list.append(post.id)
            for story in post.story:
                if text in story['payload']:
                    if post.id not in mem_list:
                        mem_list.append(post.id)
            if post.time:
                if text in post.time['data']:
                    if post.id not in mem_list:
                        mem_list.append(post.id)
            for tag in post.tags:
                if text in tag:
                    if post.id not in mem_list:
                        mem_list.append(post.id)
            for location in post.location:
                if location['type'] == 'path':
                    for points in location['points']:
                        for point in points:
                            if text in point:
                                if post.id not in mem_list:
                                    mem_list.append(post.id)
                if location['type'] == 'region':
                    if text in location['name']:
                        if post.id not in mem_list:
                            mem_list.append(post.id)
                if location['type'] == 'point':
                    if text in location['point']:
                        if post.id not in mem_list:
                            mem_list.append(post.id)

        
        for user in User.objects.all():
            if text in user.username:
                if user.username not in user_list:
                    user_list.append(user.username)
            if text in user.first_name:
                if user.username not in user_list:
                    user_list.append(user.username)
            if text in user.last_name:
                if user.username not in user_list:
                    user_list.append(user.username)
        
        return jrh.success(
            {'memory_posts':  mem_list,
            'users': user_list}
    )