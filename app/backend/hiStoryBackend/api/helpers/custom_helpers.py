from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import ValidationError
from rest_framework.views import exception_handler


def errors_from_dict_to_arr(errors_dict):
	"""
	:param errors_dict: {'key1': ['error1', 'error2', ...], 'key2': ['error1', ...], ...}
	:return: ['key1: error1', 'key1: error2', 'key1: error3', 'key2: error1', ... ]
	"""
	non_field_errors_arr = errors_dict.pop('non_field_errors', [])

	result = [f"{key}: {msg}" for key in errors_dict for msg in errors_dict[key]]
	result.extend([msg for msg in non_field_errors_arr])

	return result


def custom_exception_handler(exc, context):
	"""
	Custom exception handler for Django Rest Framework
	"""
	# Call RestFramework's default exception handler first,
	# to get the standard error response.
	response = exception_handler(exc, context)

	if not response:
		return None

	if isinstance(exc, ValidationError):
		errors_arr = errors_from_dict_to_arr(response.data)
		response.data = {'errors': errors_arr}

	else:
		response.data['errors'] = [response.data.pop('detail')]

	return response


class IsOwnerOrAdmin(BasePermission):
	"""
	Object-level permission to only allow owners of an object to edit it and
	owners and admins to delete it.
	Assumes the model instance has an `user` attribute.
	"""

	def has_object_permission(self, request, view, obj):
		if request.method == 'GET':
			if isinstance(request.user, AnonymousUser):
				return False  # Guests cannot get specific resources
			return True

		elif request.method in ('PUT', 'PATCH'):
			return obj.user == request.user

		elif request.method == 'DELETE':
			return (obj.user == request.user) or request.user.admin
		else:
			return False
