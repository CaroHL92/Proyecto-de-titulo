from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ejercicios.views import registrar_usuario, reporte_por_usuario

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ejercicios.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/registrar/', registrar_usuario, name='registrar'),
    path('api/reporte/<int:usuario_id>/', reporte_por_usuario),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
