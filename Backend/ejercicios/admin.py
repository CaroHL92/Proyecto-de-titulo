from django.contrib import admin
from .models import Nivel, Palabra, Grabacion, ReporteSemanal
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from fonoapp.models import User 

admin.site.register(Nivel)
admin.site.register(Palabra)
admin.site.register(Grabacion)
admin.site.register(ReporteSemanal)

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('tipo',)}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'tipo', 'is_staff')

admin.site.register( User, UserAdmin)