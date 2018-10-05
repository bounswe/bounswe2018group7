from django.http import JsonResponse
from api.views.helpers import json_response_helper as jrh


def response(request):
    if request.method == 'GET':
        return get(request)
    elif request.method == 'POST':
        return create(request)
    elif request.method == 'PATCH':
        return update(request)
    elif request.method == 'DELETE':
        return delete(request)
    else:
        return jrh.bad_request(['Unsupported HTTP verb'])


def get(request):
    return JsonResponse({'operation': 'get-memory-post'})


def create(request):
    return JsonResponse({'operation': 'create-memory-post'})


def update(request):
    return JsonResponse({'operation': 'update-memory-post'})


def delete(request):
    return JsonResponse({'operation': 'delete-memory-post'})
