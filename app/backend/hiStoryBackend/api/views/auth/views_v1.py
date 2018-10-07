from django.http import JsonResponse
from api.views.helpers import json_response_helper as jrh
#from api.views.helpers import custom_helper as jrh
from django.contrib.auth.hashers import check_password, make_password
import json
import jwt
from api.models import User

def sign_in(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    return JsonResponse({'operation': 'sign-in'})

def sign_up(request):
    if not request.method == 'POST':
        return jrh.bad_request(['Unsupported HTTP verb'])

    r = json.loads(request.body)

    username = r['username']
    email = r['email']
    password = r['password']
    password_confirmation = r['password_confirmation']
    full_name = r['full_name']

    '''if(User.objects.filter(username=username)):
    	return JsonResponse({'errors': ('This username is already in the database: ' + username)})

    if(User.objects.filter(email=email)):
    	return JsonResponse({'errors': ('This email is already in the database: ' + email)})'''

    if(password != password_confirmation):
    	return jrh.fail(['Passwords don\'t match.'])

    password_hash = make_password(password)

    u = User(username=username,
    	email=email,
    	password_hash=password_hash,
    	full_name=full_name
    	)
    
    #use helper
    try:
    	u.full_clean()
    except ValidationError:
    	return jrh.unauthorized(parse_validation_error(ValidationError))

    u.save()

    
    return jrh.success({'username': username, 'email': email, 'full_name': full_name})