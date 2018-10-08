import json

import jwt
from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ValidationError

from api.helpers import custom_helper
from api.helpers import json_response_helper as jrh
from api.models import User
from hiStoryBackend.settings import SECRET_KEY


def sign_in(request):
	if not request.method == 'POST':
		return jrh.bad_request(['Unsupported HTTP verb'])

	content = json.loads(request.body)

	if 'password' not in content:
		return jrh.bad_request(["password is missing"])

	if 'username' in content:
		try:
			user = User.objects.get(username = content['username'])
		except User.DoesNotExist:
			return jrh.unauthorized(["username does not exist"])
	elif 'email' in content:
		try:
			user = User.objects.get(email = content['email'])
		except User.DoesNotExist:
			return jrh.unauthorized(["email does not exist"])
	else:
		return jrh.bad_request(["username and email are both missing"])

	if check_password(content['password'], user.password_hash) == False:
		return jrh.unauthorized(["wrong password"])

	token = jwt.encode({"id": user.id}, SECRET_KEY)

	return jrh.success({"username": user.username, "email": user.email, "full_name": user.full_name, "admin": user.admin, "banned": user.banned, "auth_token": token.decode("utf-8")})

def sign_up(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    r = json.loads(request.body)

    username = r.get('username')
    email = r.get('email')
    password = r.get('password')
    password_confirmation = r.get('password_confirmation')
    full_name = r.get('full_name')

    if(password is None):
        return jrh.bad_request(["Password cannot be empty."])

    if(len(password) < 8):
        return jrh.fail(["Passwords shall contain at least 8 characters."])

    if(len(password) > 24):
        return jrh.fail(["Passwords shall contain at most 24 characters."])

    if(password != password_confirmation):
    	return jrh.fail(["Passwords don't match."])

    password_hash = make_password(password)

    u = User(username=username,
    	email=email,
    	password_hash=password_hash,
    	full_name=full_name,
    	confirmed=True
    	)
    
    try:
        u.full_clean()
    except ValidationError as ve:
        errors_arr = custom_helper.parse_validation_error(ve)
        return jrh.fail(errors_arr)

    u.save()

    
    return jrh.success({'username': username, 'email': email, 'full_name': full_name})