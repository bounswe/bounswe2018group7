from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from api.helpers import custom_helpers
from api.helpers import json_response_helpers as jrh
from api.models import User
import re

email_regex = re.compile('(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)')


class SignUpView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password', '')
        password_confirmation = request.data.get('password_confirmation', '')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        if len(password) < 8:
            return jrh.fail(["Passwords shall contain at least 8 characters."])

        if password != password_confirmation:
            return jrh.fail(["Passwords don't match."])

        user = User(username=username, email=email)

        if first_name:
            user.first_name = first_name

        if last_name:
            user.last_name = last_name

        user.set_password(password)

        try:
            user.full_clean()
        except ValidationError as ve:
            errors_arr = custom_helpers.parse_validation_error(ve)
            return jrh.fail(errors_arr)

        user.save()

        user.send_confirmation_email()

        return jrh.success(
            {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'confirmed': user.confirmed
            }
        )


class SignInView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        identity = request.data.get('identity')
        if not identity:
            return jrh.bad_request(["'identity' parameter is missing"])

        if email_regex.match(identity):
            try:
                user = User.objects.get(email=identity)
            except User.DoesNotExist:
                return jrh.unauthorized(["User with this email does not exist."])
        else:
            try:
                user = User.objects.get(username=identity)
            except User.DoesNotExist:
                return jrh.unauthorized(["User with this username does not exist."])

        if not user.check_password(request.data.get('password')):
            return jrh.unauthorized(["Wrong password."])

        token, _ = Token.objects.get_or_create(user=user)

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        return jrh.success(
            {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'confirmed': user.confirmed,
                'admin': user.admin,
                'banned': user.banned,
                'auth_token': token.key
            }
        )


class SignOutView(APIView):
    def post(self, request, format=None):
        request.user.auth_token.delete()
        request.user.last_login = None
        request.user.save(update_fields=['last_login'])
        return jrh.success({})


class EmailConfirmationView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        email = request.data.get("email")
        token = request.data.get("token")

        if token:  # If 'token' parameter is given, confirm that User
            try:
                user = User.objects.get(confirmation_token=token)
            except User.DoesNotExist:
                return jrh.not_found(['User not found.'])

            user.confirmation_token = None
            user.confirmed = True
            user.save(update_fields=['confirmation_token', 'confirmed'])

            return jrh.success({})

        elif email:  # If 'email' parameter is given, send a confirmation email to that User
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return jrh.not_found(['User not found.'])

            if user.confirmed:
                return jrh.fail(['This User has already been confirmed.'])

            if user.send_confirmation_email():
                return jrh.success({})
            else:
                return jrh.fail(['An error occurred while trying to send a confirmation email.'])

        else:
            return jrh.bad_request(["Both 'email' and 'token' parameters are missing."])
