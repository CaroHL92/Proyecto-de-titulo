from django.contrib import admin
from .models import Nivel, Palabra, Grabacion, ReporteSemanal

admin.site.register(Nivel)
admin.site.register(Palabra)
admin.site.register(Grabacion)
admin.site.register(ReporteSemanal)
