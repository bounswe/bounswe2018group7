from django.db import IntegrityError
from rest_framework import mixins, generics
from rest_framework.permissions import IsAuthenticated
from api.helpers import json_response_helpers as jrh

from api.helpers.custom_helpers import IsOwnerOrAdmin
from api.models import Annotation
from api.serializers import AnnotationSerializer


class AnnotationView(mixins.ListModelMixin,
					 mixins.RetrieveModelMixin,
					 mixins.CreateModelMixin,
					 mixins.UpdateModelMixin,
					 mixins.DestroyModelMixin,
					 generics.GenericAPIView):

	permission_classes = (IsAuthenticated, IsOwnerOrAdmin)
	queryset = Annotation.objects.all()
	serializer_class = AnnotationSerializer
	lookup_field = 'id'

	def get(self, request, *args, **kwargs):
		if kwargs.get("id"):
			return self.retrieve(request, *args, **kwargs)  # Comes from RetrieveModelMixin
		else:
			annotation_target = request.GET.get('target')
			if annotation_target:
				self.queryset = self.queryset.filter(target__icontains="\"source\": \"" + str(annotation_target) + "\"")
				return self.list(request, *args, **kwargs)
			else:
				return jrh.fail(["'id' URL parameter is missing."])

	def post(self, request, *args, **kwargs):
		request.data['user'] = request.user.id
		try:
			return self.create(request, *args, **kwargs)  # Comes from CreateModelMixin
		except IntegrityError:
			return jrh.fail(['Duplicate Annotation'])

	def patch(self, request, *args, **kwargs):
		try:
			return self.partial_update(request, *args, **kwargs)  # Comes from UpdateModelMixin
		except IntegrityError:
			return jrh.fail(['Duplicate Annotation'])

	def delete(self, request, *args, **kwargs):
		return self.destroy(request, *args, **kwargs)  # Comes from DestroyModelMixin
