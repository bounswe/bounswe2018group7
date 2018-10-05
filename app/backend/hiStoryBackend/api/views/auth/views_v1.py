from django.http import JsonResponse
from api.views.helpers import json_response_helper as jrh


def sign_in(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    return JsonResponse({'operation': 'sign-in'})


def sign_up(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    return JsonResponse({'operation': 'sign-up'})
