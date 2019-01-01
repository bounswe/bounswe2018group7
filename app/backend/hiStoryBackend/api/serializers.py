import json
import re
from json import JSONDecodeError

from django.core.exceptions import ValidationError
from django.core.files.base import File
from django.core.validators import URLValidator
from rest_framework import serializers

from api.helpers.custom_helpers import errors_from_dict_to_arr
from api.models import *


def check_field_for_url(msg_prefix, url_string):
    val = URLValidator()
    try:
        val(str(url_string))
    except ValidationError:
        raise serializers.ValidationError(msg_prefix + " is not a valid URL")


class CustomBaseModelSerializer(serializers.ModelSerializer):
    @property
    def errors_arr(self):
        return errors_from_dict_to_arr(self.errors)


class ReadOnlyUsernameFieldMixin(serializers.Serializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username


class UserSerializer(CustomBaseModelSerializer):
    password_confirmation = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'admin', 'confirmed', 'banned',
                  'profile_picture', 'password', 'password_confirmation')
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

        # File name of the profile picture needs User id. Hence, add it after User is saved
        profile_picture = validated_data.get('profile_picture')
        if profile_picture:
            user.profile_picture = profile_picture
            user.save(update_fields=['profile_picture'])

        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)

        email = validated_data.get('email')
        if email:
            instance.email = email
            instance.confirmed = False
            instance.send_confirmation_email()

        password = validated_data.get('password')
        if password:
            instance.set_password(password)
            instance.password_reset_token = None

        if validated_data.get('profile_picture'):
            instance.profile_picture.delete()  # Delete previous profile picture if exists
            instance.profile_picture = validated_data.get('profile_picture')

        instance.save()

        return instance


class CommentSerializer(ReadOnlyUsernameFieldMixin,
                        CustomBaseModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'memory_post', 'username', 'content', 'created')


class MemoryPostSerializer(ReadOnlyUsernameFieldMixin,
                           CustomBaseModelSerializer):
    story_arr = serializers.ListField(write_only=True)

    story = serializers.JSONField(read_only=True, required=False)
    time = serializers.JSONField(required=False)
    tags = serializers.JSONField(required=False, default=[])
    location = serializers.JSONField(required=False, default=[])
    comments = CommentSerializer(many=True, read_only=True)
    reactions = serializers.SerializerMethodField()

    class Meta:
        model = MemoryPost
        exclude = ('user',)

    def get_reactions(self, obj):
        try:
            user = self.context['request'].user
            if isinstance(user, User):
                user_reaction = Reaction.objects.get(user=user, memory_post=obj)
                user_liked = user_reaction.like
            else:
                user_liked = None
        except Reaction.DoesNotExist:
            user_liked = None

        return {
            'current_user_liked': user_liked,
            'like': Reaction.objects.filter(memory_post=obj, like=True).count(),
            'dislike': Reaction.objects.filter(memory_post=obj, like=False).count()
        }

    def validate_json_array(self, field_value):
        if isinstance(field_value, str):
            try:
                field_arr = json.loads(field_value)
                if isinstance(field_arr, list):
                    return field_arr
            except JSONDecodeError:
                pass
        elif isinstance(field_value, list):
            return field_value

        raise serializers.ValidationError("This field must be a JSON-Array (plain or String encoded)")

    def validate_time(self, value):
        if isinstance(value, str):
            try:
                field_dict = json.loads(value)
                if isinstance(field_dict, dict):
                    return field_dict
            except JSONDecodeError:
                pass
        elif isinstance(value, dict):
            return value

        raise serializers.ValidationError("This field must be a JSON object (plain or String encoded)")

    def validate_tags(self, value):
        return self.validate_json_array(value)

    def validate_location(self, value):
        return self.validate_json_array(value)

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
        instance.title = validated_data.get('title', instance.title)
        instance.time = validated_data.get('time', instance.time)
        instance.tags = validated_data.get('tags', instance.tags)
        instance.location = validated_data.get('location', instance.location)

        story_arr = validated_data.get('story_arr')
        if story_arr:
            instance.memorymedia_set.all().delete()  # Delete all the old MemoryMedia items
            instance.story = self.create_memory_post_story(instance, story_arr)

        instance.save()

        return instance


class ReactionSerializer(ReadOnlyUsernameFieldMixin,
                         CustomBaseModelSerializer):
    class Meta:
        model = Reaction
        fields = ('id', 'memory_post', 'username', 'like')
        validators = ()


class ProfileMemoryPostSerializer(CustomBaseModelSerializer):
    class Meta:
        model = MemoryPost
        fields = ('id', 'title')


class AnnotationSerializer(CustomBaseModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    creator = serializers.SerializerMethodField()
    generated = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", read_only=True, source='updated')
    body = serializers.JSONField(required=True)
    target = serializers.JSONField(required=True)

    class Meta:
        model = Annotation
        fields = ('@context', 'type', 'id', 'creator', 'generated', 'body', 'target', 'user')
        extra_kwargs = {'user': {'write_only': True}}

    def get_context(self, obj):
        return "http://www.w3.org/ns/anno.jsonld"

    def get_type(self, obj):
        return "Annotation"

    def get_id(self, obj):
        try:
            return settings.SITE_URL + "api/v" + settings.API_VERSION + "/annotations/" + str(obj.id)
        except AttributeError:
            return None

    def get_creator(self, obj):
        try:
            return settings.SITE_URL + "api/v" + settings.API_VERSION + "/profiles/" + obj.user.username
        except AttributeError:
            return None

    def validate_body(self, body):
        body_type = body.get("type")
        if not body_type:
            raise serializers.ValidationError("'type' is missing.")

        body_type = str(body_type)
        if body_type == 'TextualBody':
            body_value = body.get("value")

            if not body_value:
                raise serializers.ValidationError("'value' is missing.")

            return {
                "type": "TextualBody",
                "value": str(body_value)
            }

        elif body_type in ('Image', 'Video', 'Sound'):
            body_id = body.get("id")

            if not body_id:
                raise serializers.ValidationError("'id' is missing.")

            check_field_for_url("'id'", body_id)

            return {
                "type": body_type,
                "id": body_id
            }

        else:
            raise serializers.ValidationError("Provided 'type' is not supported.")

    def validate_target(self, target):
        target_source = target.get("source")
        if not target_source:
            raise serializers.ValidationError("'source' is missing.")

        target_source = str(target_source).lower()

        memory_post_api_url_pattern = settings.SITE_URL + "api/v" + settings.API_VERSION + "/memory_posts/\d+"
        if not (re.match(memory_post_api_url_pattern, target_source) or settings.MEDIA_SITE_URL in target_source):
            raise serializers.ValidationError("does not belong to HiStory")

        check_field_for_url("'source'", target_source)

        target_selector = target.get("selector")

        if not target_selector:
            return {
                "source": target_source
            }

        elif not isinstance(target_selector, dict):
            raise serializers.ValidationError("'selector' must be a JSON.")

        else:
            selector_type = target_selector.get("type")
            if not selector_type:
                raise serializers.ValidationError("'type' of 'selector' is missing.")

            selector_type = str(selector_type)

            if selector_type == 'TextQuoteSelector':
                exact_key = target_selector.get("exact")
                if not exact_key:
                    raise serializers.ValidationError("'exact' of 'selector' is missing.")

                prefix_key = target_selector.get("prefix")
                if not prefix_key:
                    raise serializers.ValidationError("'prefix' of 'selector' is missing.")

                suffix_key = target_selector.get("suffix")
                if not suffix_key:
                    raise serializers.ValidationError("'suffix' of 'selector' is missing.")

                return {
                    "source": target_source,
                    "selector": {
                        "type": "TextQuoteSelector",
                        "exact": str(exact_key),
                        "prefix": str(prefix_key),
                        "suffix": str(suffix_key)
                    }
                }

            elif selector_type == 'FragmentSelector':
                value_key = target_selector.get("value")
                if not value_key:
                    raise serializers.ValidationError("'value' of 'selector' is missing.")

                value_key = str(value_key).lower()
                match_object = re.match(r'^xywh=\d+,\d+,\d+,\d+$', value_key)
                if not match_object:
                    raise serializers.ValidationError("'value' of 'selector' must be in the form 'xywh=<number>,<number>,<number>,<number>")

                return {
                    "source": target_source,
                    "selector": {
                        "type": "FragmentSelector",
                        "conformsTo": "http://www.w3.org/TR/media-frags/",
                        "value": value_key
                    }
                }

            else:
                raise serializers.ValidationError("Provided 'type' for 'selector' is not supported.")

    def create(self, validated_data):
        annotation = Annotation(**validated_data)
        annotation.save()
        return annotation

    def update(self, instance, validated_data):
        instance.body = validated_data.get('body', instance.body)
        instance.target = validated_data.get('target', instance.target)
        instance.save()
        return instance


AnnotationSerializer._declared_fields["@context"] = serializers.SerializerMethodField(method_name='get_context')
