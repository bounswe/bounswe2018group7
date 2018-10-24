from api.models import User
from rest_framework import serializers
from api.helpers.custom_helpers import errors_from_dict_to_arr


class CustomBaseSerializer(serializers.ModelSerializer):
    @property
    def errors_arr(self):
        return errors_from_dict_to_arr(self.errors)


class UserSerializer(CustomBaseSerializer):
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
