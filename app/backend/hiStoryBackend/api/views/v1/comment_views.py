from rest_framework import mixins, generics
from rest_framework.permissions import IsAuthenticated

from api.helpers.custom_helpers import IsOwnerOrAdmin
from api.models import Comment
from api.serializers import CommentSerializer
from api.helpers import json_response_helpers as jrh


class CommentView(mixins.ListModelMixin,
				  mixins.DestroyModelMixin,
				  generics.GenericAPIView):

	permission_classes = (IsAuthenticated, IsOwnerOrAdmin)
	queryset = Comment.objects.all().order_by('id')
	serializer_class = CommentSerializer
	lookup_field = 'id'

	def get(self, request, *args, **kwargs):
		memory_post = request.GET.get('memory_post')
		if memory_post:
			queryset = self.get_queryset().filter(memory_post=memory_post)
		else:
			queryset = self.get_queryset().filter(user=request.user)

		self.queryset = queryset
		return self.list(request, *args, **kwargs)  # Comes from ListModelMixin

	def post(self, request, *args, **kwargs):
		comment_serializer = self.get_serializer(data=request.data)
		if comment_serializer.is_valid():
			comment_serializer.save(user=request.user)
			return jrh.success(comment_serializer.data)
		else:
			return jrh.fail(comment_serializer.errors_arr)

	def delete(self, request, *args, **kwargs):
		if not kwargs.get("id"):
			return jrh.fail(["'id' URL parameter is missing."])

		return self.destroy(request, *args, **kwargs)  # Comes from DestroyModelMixin
