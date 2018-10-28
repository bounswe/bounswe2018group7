from django.contrib.auth.models import AnonymousUser
from rest_framework import generics, mixins
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
					 mixins.UpdateModelMixin,
					 mixins.DestroyModelMixin,
					 generics.GenericAPIView):

	permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrAdmin)
	queryset = MemoryPost.objects.all()
	serializer_class = MemoryPostSerializer
	lookup_field = 'id'
	pagination_class = MemoryPostPageNumberPagination

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
		memory_post_serializer = self.get_serializer(data=request.data)
		if memory_post_serializer.is_valid():
			memory_post_serializer.save(user=request.user)
			return jrh.success(memory_post_serializer.data)
		else:
			return jrh.fail(memory_post_serializer.errors_arr)

	def put(self, request, *args, **kwargs):
		if not kwargs.get("id"):
			return jrh.fail(["'id' URL parameter is missing."])

		return self.update(request, *args, **kwargs)  # Comes from UpdateModelMixin

	def delete(self, request, *args, **kwargs):
		if not kwargs.get("id"):
			return jrh.fail(["'id' URL parameter is missing."])

		return self.destroy(request, *args, **kwargs)  # Comes from DestroyModelMixin
