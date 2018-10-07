from django.http import JsonResponse
from api.views.helpers import json_response_helper as jrh
from django.contrib.auth.hashers import check_password, make_password
import json
from api.models import User
import jwt
from hiStoryBackend.settings import SECRET_KEY

def sign_in(request):
	if not request.method == 'POST':
		return jrh.bad_request(['Unsupported HTTP verb'])

	content = json.loads(request.body)
	if 'username' in content:
		try:
			user = User.objects.get(username = content['username'])
		except User.DoesNotExist:
			return JsonResponse({"errors": ["username does not exist"]})
	elif 'email' in content:
		try:
			user = User.objects.get(email = content['email'])
		except User.DoesNotExist:
			return JsonResponse({"errors": ["email does not exist"]})
	else:
		return JsonResponse({"errors": ["username or email fields could not be found"]})

	if check_password(content['password'], user.password_hash) == False:
		return JsonResponse({"errors": ["wrong password"]})

	if user.banned:
		return JsonResponse({"errors": ["user is banned"]})

	token = jwt.encode({"id": user.id}, SECRET_KEY)

	return JsonResponse({"username": user.username, "email": user.email, "full_name": user.full_name, "admin": user.admin, "banned": user.banned, "auth_token": token.decode("utf-8")})


def sign_up(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    return JsonResponse({'operation': 'sign-up'})
