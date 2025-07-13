from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from .models import Nivel, Palabra, Grabacion, ReporteSemanal
from django.db.models import Count, Max, Sum
from .serializers import NivelSerializer, PalabraSerializer, GrabacionSerializer, ReporteSemanalSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now, timedelta
from rest_framework.permissions import IsAuthenticated
from fonoapp.models import User
from rest_framework import status


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
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
def registrar_usuario(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Usuario y contraseña requeridos"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "El usuario ya existe"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "Usuario creado exitosamente"}, status=201)

class ReporteSemanalViewSet(viewsets.ModelViewSet):
    queryset = ReporteSemanal.objects.all()
    serializer_class = ReporteSemanalSerializer

class ReporteUsuario(APIView):
    def get(self, request, usuario_id):
        grabaciones = Grabacion.objects.filter(usuario_id=usuario_id)
        total_duracion = sum([g.duracion for g in grabaciones])
        ultima_fecha = grabaciones.order_by('-fecha').first().fecha if grabaciones else None

        # Agrupar por semana
        semana_actual = now().isocalendar()[1]
        grabaciones_esta_semana = grabaciones.filter(fecha__week=semana_actual).count()

        serializer = GrabacionSerializer(grabaciones, many=True)

        return Response({
            'total_duracion': total_duracion,
            'ultima_fecha': ultima_fecha,
            'grabaciones_esta_semana': grabaciones_esta_semana,
            'grabaciones': serializer.data,
        })