from django.http import JsonResponse
from api.views.helpers import json_response_helper as jrh
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
    passwordConfirmation = r['password_confirmation']
    fullName = r['full_name']

    if(User.objects.filter(username=username)):
    	return JsonResponse({'errors': ('This username is already in the database: ' + username)})

    if(User.objects.filter(email=email)):
    	return JsonResponse({'errors': ('This email is already in the database: ' + email)})

    if(password != passwordConfirmation):
    	return JsonResponse({'errors': 'Passwords don\'t match.'})

    passwordHash = jwt.encode({ 'password': password}, 'secret', algorithm='HS256')

    u = User(username=username,
    	email=email,
    	password_hash=passwordHash,
    	full_name=fullName
    	)
    # ask about clean all
    u.save()

    
    return JsonResponse({'username': username, 'email': email, 'full_name': fullName})