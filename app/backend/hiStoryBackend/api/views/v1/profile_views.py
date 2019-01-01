import json
from json import JSONDecodeError

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import MemoryPost, User
from api.serializers import UserSerializer, ProfileMemoryPostSerializer
from api.helpers import json_response_helpers as jrh


class ProfileView(APIView):
    def get(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if not username or username == request.user.username:
            user = request.user
        else:
            user = get_object_or_404(User, username=username)

        result = {
            **UserSerializer(user).data,
            'created_memory_posts': ProfileMemoryPostSerializer(MemoryPost.objects.filter(user=user), many=True).data
        }

        if user == request.user:
            result['liked_memory_posts'] = ProfileMemoryPostSerializer(
                MemoryPost.objects.filter(reactions__user=user, reactions__like=True), many=True
            ).data

        return jrh.success(result)

    def ban_or_unban_user(self, username, ban, current_user):
        if not username:
            return jrh.fail(["'username' URL parameter is missing."])

        if not current_user.admin:
            return jrh.unauthorized(['You do not have permission to perform this operation.'])

        user_to_ban = get_object_or_404(User, username=username)
        user_to_ban.ban(ban)
        return jrh.success(UserSerializer(user_to_ban).data)

    def patch(self, request, *args, **kwargs):
        try:
            ban = request.data.get('ban')
            if isinstance(ban, str):
                ban = json.loads(ban)

            if isinstance(ban, bool):
                return self.ban_or_unban_user(kwargs.get('username'), ban, request.user)
        except JSONDecodeError:
            pass

        user_serializer = UserSerializer(request.user, request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            return jrh.success(user_serializer.data)
        else:
            return jrh.fail(user_serializer.errors_arr)

    def delete(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if not username or username == request.user.username:  # User wants to delete his/her profile
            user = request.user
        else:  # User wants to delete another profile
            if request.user.admin:  # Check if current User is admin
                user = get_object_or_404(User, username=username)
            else:
                return jrh.unauthorized(['You do not have permission to perform this operation.'])

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
