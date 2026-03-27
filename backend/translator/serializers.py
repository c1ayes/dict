from rest_framework import serializers
from .models import Word
from django.contrib.auth.models import User


class WordSerializer(serializers.Serializer):
    text = serializers.CharField()
    from_lang = serializers.ChoiceField(
        choices=['ru', 'en']
    )
    to_lang = serializers.ChoiceField(
        choices=['ru', 'en']
    )

class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ('id','original', 'translated', 'theme', 'learnt')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError({"username": "Пользователь уже существует"})
        return value
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)