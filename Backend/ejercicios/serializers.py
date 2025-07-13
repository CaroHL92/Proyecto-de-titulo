from rest_framework import serializers
from .models import Nivel, Palabra, Grabacion, ReporteSemanal
from fonoapp.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'tipo']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            tipo=validated_data.get('tipo', 'niño')
        )
        return user

class NivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nivel
        fields = '__all__'

class PalabraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palabra
        fields = '__all__'


class GrabacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grabacion
        fields = '__all__'

class ReporteSemanalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteSemanal
        fields = '__all__'
