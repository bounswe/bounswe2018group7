import json
from json import JSONDecodeError
from api.models import User
from api.models import MemoryPost
from api.models import MemoryMedia
from django.core.files.base import File
from rest_framework import serializers
from api.helpers.custom_helpers import errors_from_dict_to_arr


class CustomBaseModelSerializer(serializers.ModelSerializer):
	@property
	def errors_arr(self):
		return errors_from_dict_to_arr(self.errors)


class UserSerializer(CustomBaseModelSerializer):
	password_confirmation = serializers.CharField(max_length=255, write_only=True)

	class Meta:
		model = User
		fields = ('username', 'email', 'first_name', 'last_name', 'admin', 'confirmed', 'banned',
				  'password', 'password_confirmation')
		extra_kwargs = {'password': {'write_only': True}}

	def validate(self, data):
		password = data.get('password', None)
		if password:
			if len(password) < 8:
				raise serializers.ValidationError("Password must be at least 8 characters long.")

			if password != data.get('password_confirmation', None):
				raise serializers.ValidationError("'password' does not match 'password_confirmation'")

		return data

	def create(self, validated_data):
		user = User(username=validated_data['username'],
					email=validated_data['email'],
					first_name=validated_data.get('first_name', ''),
					last_name=validated_data.get('last_name', '')
					)
		user.set_password(validated_data['password'])
		user.save()

		return user

	def update(self, instance, validated_data):
		instance.username = validated_data.get('username', instance.username)
		instance.email = validated_data.get('email', instance.email)
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)

		password = validated_data.get('password', None)
		if password:
			instance.set_password(password)
			instance.password_reset_token = None

		instance.save()

		return instance


class MemoryPostSerializer(CustomBaseModelSerializer):
	story_arr = serializers.ListField(write_only=True)

	story = serializers.JSONField(read_only=True, required=False)
	location = serializers.JSONField(required=False, default=[])
	time = serializers.JSONField(required=False, default=[])
	username = serializers.SerializerMethodField()

	class Meta:
		model = MemoryPost
		exclude = ('user',)

	def get_username(self, obj):
		return obj.user.username

	def validate_json_array(self, field_name, field_value):
		if isinstance(field_value, str):
			try:
				field_arr = json.loads(field_value)
				if isinstance(field_arr, list):
					return field_arr
			except JSONDecodeError:
				pass
		elif isinstance(field_value, list):
			return field_value

		raise serializers.ValidationError({field_name: "must be a JSON-Array (plain or String encoded)"})

	def validate_time(self, value):
		return self.validate_json_array('time', value)

	def validate_location(self, value):
		return self.validate_json_array('location', value)

	def create_memory_post_story(self, memory_post, story_arr):
		story = []
		for i, item in enumerate(story_arr):
			if isinstance(item, File):
				if not item.content_type.split('/')[0] in ('audio', 'image', 'video'):
					continue

				memory_media = MemoryMedia(memory_post=memory_post,
										   type=item.content_type,
										   order=i,
										   file=item)
				memory_media.save()
				story.append({"type": item.content_type, "payload": memory_media.file.url})
			elif isinstance(item, str):
				story.append({"type": "text", "payload": item})

		return story

	def create(self, validated_data):
		story_arr = validated_data.pop('story_arr')
		memory_post = MemoryPost(**validated_data)
		memory_post.save()
		memory_post.story = self.create_memory_post_story(memory_post, story_arr)
		memory_post.save()

		return memory_post

	def update(self, instance, validated_data):
		instance.memorymedia_set.all().delete()  # First, delete all old MemoryMedia items

		instance.title = validated_data.get('title')
		instance.time = validated_data.get('time')
		instance.location = validated_data.get('location')
		instance.story = self.create_memory_post_story(instance, validated_data['story_arr'])
		instance.save()

		return instance
