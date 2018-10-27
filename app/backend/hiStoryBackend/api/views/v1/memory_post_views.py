from rest_framework.views import APIView

from api.helpers import json_response_helpers as jrh
from api.models import MemoryPost
from api.serializers import MemoryPostSerializer

class MemoryPostView(APIView):

	def post(self, request, format = None):
		memory_post_serializer = MemoryPostSerializer(data = request.data)
		if memory_post_serializer.is_valid():
			memory_post = memory_post_serializer.save(user = request.user, story = request.data.getlist('story[]', []))
			return jrh.success(memory_post_serializer.data)
		else:
			return jrh.fail(memory_post_serializer.errors_arr)