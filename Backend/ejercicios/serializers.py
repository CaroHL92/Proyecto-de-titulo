from rest_framework import serializers
from .models import Nivel, Palabra, Grabacion, ReporteSemanal

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
