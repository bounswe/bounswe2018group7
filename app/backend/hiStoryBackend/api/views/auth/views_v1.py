from django.http import JsonResponse
from api.helpers import json_response_helper as jrh
from api.helpers import custom_helper
from django.contrib.auth.hashers import check_password, make_password
import json
import jwt
from api.models import User
from django.core.exceptions import ValidationError

def sign_in(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    return JsonResponse({'operation': 'sign-in'})

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
        return jrh.fail(["Password cannot be empty."])

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