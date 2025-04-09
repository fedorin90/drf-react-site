import requests
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import ToDo, Image

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "avatar")


class GoogleAuthSerializer(serializers.Serializer):
    access_token = serializers.CharField()

    def validate_access_token(self, access_token):
        google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={access_token}"
        response = requests.get(google_url)
        if response.status_code != 200:
            raise serializers.ValidationError("Invalid Google token")

        data = response.json()
        email = data.get("email")

        if not email:
            raise serializers.ValidationError("Google account has no email")

        user, _ = User.objects.get_or_create(email=email, defaults={"is_active": True})

        token, _ = Token.objects.get_or_create(user=user)  # pylint: disable=no-member

        return token.key


class ToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDo
        fields = "__all__"
        read_only_fields = ("user",)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = "__all__"
        read_only_fields = ("user",)
