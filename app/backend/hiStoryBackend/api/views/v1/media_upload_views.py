from rest_framework.views import APIView
from api.helpers import json_response_helpers as jrh
from api.models import MediaUpload
from django.core.files.base import File


class MediaUploadView(APIView):
	def post(self, request, format=None):
		file_type = request.build_absolute_uri().split('media_upload/')[-1]
		file = request.data.get('file')

		if isinstance(file, File):
			if not file.content_type.split('/')[0] in ('audio', 'image', 'video'):
				return jrh.fail(["Only 'image', 'video' and 'audio' files can be uploaded."])

		else:
			return jrh.fail(['Invalid file.'])

		media_upload = MediaUpload(type= file_type, user=request.user, file=file)
		try:
			media_upload.save()
			return jrh.success({'file_url': media_upload.file.url})
		except RuntimeError as err:
			return jrh.fail(["{0}".format(err)])
