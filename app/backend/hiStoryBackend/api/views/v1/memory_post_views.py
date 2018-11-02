import re

from django.contrib.auth.models import AnonymousUser
from rest_framework import generics, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from api.helpers import json_response_helpers as jrh
from api.helpers.custom_helpers import IsOwnerOrAdmin
from api.models import MemoryPost
from api.serializers import MemoryPostSerializer


class MemoryPostPageNumberPagination(PageNumberPagination):
	page_size = 10


class MemoryPostView(mixins.ListModelMixin,
					 mixins.RetrieveModelMixin,
					 mixins.DestroyModelMixin,
					 generics.GenericAPIView):

	permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrAdmin)
	queryset = MemoryPost.objects.all()
	serializer_class = MemoryPostSerializer
	lookup_field = 'id'
	pagination_class = MemoryPostPageNumberPagination

	def parse_request_data(self, request_data):
		story_pattern = re.compile(r"^story\[\d+\]$")  # Matches 'story[<digit>]'
		story_keys = [key for key in request_data.keys() if story_pattern.match(key)]
		if len(story_keys) == 0:
			story_arr = None
		else:
			story_keys.sort()
			story_arr = [request_data[key] for key in story_keys]

		data = {}

		if story_arr:
			data['story_arr'] = story_arr

		if 'title' in request_data:
			data['title'] = request_data.get('title')

		if 'time' in request_data:
			data['time'] = request_data.get('time')

		if 'location' in request_data:
			data['location'] = request_data.get('location')

		return data

	def get(self, request, *args, **kwargs):
		if kwargs.get("id"):
			return self.retrieve(request, *args, **kwargs)  # Comes from RetrieveModelMixin
		else:
			queryset = self.get_queryset().order_by('id').reverse()
			if isinstance(request.user, AnonymousUser):
				queryset = queryset[:10]  # Guests can see last 10 MemoryPosts

			self.queryset = queryset
			return self.list(request, *args, **kwargs)  # Comes from ListModelMixin

	def post(self, request, *args, **kwargs):
		memory_post_serializer = self.get_serializer(data=self.parse_request_data(request.data))
		if memory_post_serializer.is_valid():
			memory_post_serializer.save(user=request.user)
			return jrh.success(memory_post_serializer.data)
		else:
			return jrh.fail(memory_post_serializer.errors_arr)

	def patch(self, request, *args, **kwargs):
		id_param = kwargs.get("id")
		if not id_param:
			return jrh.fail(["'id' URL parameter is missing."])

		memory_post = get_object_or_404(MemoryPost, pk=id_param)
		self.check_object_permissions(request, memory_post)

		memory_post_serializer = self.get_serializer(memory_post, data=self.parse_request_data(request.data), partial=True)
		if memory_post_serializer.is_valid():
			memory_post_serializer.save()
			return jrh.success(memory_post_serializer.data)
		else:
			return jrh.fail(memory_post_serializer.errors_arr)

	def delete(self, request, *args, **kwargs):
		if not kwargs.get("id"):
			return jrh.fail(["'id' URL parameter is missing."])

		return self.destroy(request, *args, **kwargs)  # Comes from DestroyModelMixin
