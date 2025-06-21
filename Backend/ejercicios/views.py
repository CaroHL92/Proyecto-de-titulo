from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import Nivel, Palabra, Grabacion, ReporteSemanal
from django.db.models import Count, Max, Sum
from .serializers import NivelSerializer, PalabraSerializer, GrabacionSerializer, ReporteSemanalSerializer


class NivelViewSet(viewsets.ModelViewSet):
    queryset = Nivel.objects.all()
    serializer_class = NivelSerializer

class PalabraViewSet(viewsets.ModelViewSet):
    queryset = Palabra.objects.all()
    serializer_class = PalabraSerializer

    def get_queryset(self):
        nivel_id = self.request.query_params.get('nivel')
        if nivel_id:
            return self.queryset.filter(nivel__id=nivel_id)
        return self.queryset

class GrabacionViewSet(viewsets.ModelViewSet):
    queryset = Grabacion.objects.all()
    serializer_class = GrabacionSerializer

@api_view(['GET'])

def reporte_por_usuario(request, usuario_id):
    data = (
        Grabacion.objects
        .filter(usuario_id=usuario_id)
        .values('palabra__texto')
        .annotate(
            veces=Count('id'),
            ultima=Max('fecha'),
            duracion_total=Sum('duracion')
        )
        .order_by('palabra__texto')
    )
    return Response(data)

class ReporteSemanalViewSet(viewsets.ModelViewSet):
    queryset = ReporteSemanal.objects.all()
    serializer_class = ReporteSemanalSerializer
