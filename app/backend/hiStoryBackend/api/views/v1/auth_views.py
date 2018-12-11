import re

from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from api.helpers import json_response_helpers as jrh
from api.models import User
from api.serializers import UserSerializer

email_regex = re.compile('(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)')


class SignUpView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.send_confirmation_email()

            return jrh.success(user_serializer.data)

        else:
            return jrh.fail(user_serializer.errors_arr)


class SignInView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        identity = request.data.get('identity')
        if not identity:
            return jrh.fail(["'identity' parameter is missing"])

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

        auth_token = None

        if user.confirmed and not user.banned:
            token, _ = Token.objects.get_or_create(user=user)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            auth_token = token.key

        return jrh.success(
            {**UserSerializer(user).data, 'auth_token': auth_token}
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
                return jrh.error_response(['An error occurred while trying to send a confirmation email.'], 500)

        else:
            return jrh.fail(["Both 'email' and 'token' parameters are missing."])


class PasswordResetView(APIView):
    permission_classes = ()

    def post(self, request, format=None):
        email = request.data.get("email")
        token = request.data.get("token")
        password = request.data.get("password")
        password_confirmation = request.data.get("password_confirmation")

        if token:  # If 'token' parameter is given, reset that User's password
            try:
                user = User.objects.get(password_reset_token=token)
            except User.DoesNotExist:
                return jrh.not_found(['User not found.'])

            user_serializer = UserSerializer(user,
                                             {'password': password, 'password_confirmation': password_confirmation},
                                             partial=True
                                             )

            if user_serializer.is_valid():
                user_serializer.save()
                return jrh.success({})
            else:
                return jrh.fail(user_serializer.errors_arr)

        elif email:  # If 'email' parameter is given, send a password reset email to that User
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return jrh.not_found(['User not found.'])

            if user.send_password_reset_email():
                return jrh.success({})
            else:
                return jrh.error_response(['An error occurred while trying to send a password reset email.'], 500)

        else:
            return jrh.fail(["Both 'email' and 'token' parameters are missing."])
