from django.urls import path, include
from rest_framework import routers
from .views import NivelViewSet, PalabraViewSet, GrabacionViewSet, ReporteSemanalViewSet, reporte_por_usuario
from .views_user import user_me, registrar_usuario
from .views import ReporteUsuario, reporte_por_usuario


router = routers.DefaultRouter()
router.register(r'niveles', NivelViewSet)
router.register(r'palabras', PalabraViewSet)
router.register(r'grabaciones', GrabacionViewSet)
router.register(r'reportes', ReporteSemanalViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/reporte/<int:usuario_id>/', reporte_por_usuario),
    path('users/me/', user_me),
    path('register/', registrar_usuario),
]
