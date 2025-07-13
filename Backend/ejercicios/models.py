from django.db import models
from django.conf import settings


class Nivel(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Palabra(models.Model):
    texto = models.CharField(max_length=100)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE)

    def __str__(self):
        return self.texto

class Grabacion(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='grabaciones')
    palabra = models.ForeignKey(Palabra, on_delete=models.CASCADE)
    archivo_audio = models.FileField(upload_to='grabaciones/')
    fecha = models.DateTimeField(auto_now_add=True)
    repeticiones = models.IntegerField(default=1)
    duracion = models.FloatField()  # segundos

class ReporteSemanal(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    semana = models.DateField()
    total_repeticiones = models.IntegerField()
    tiempo_total = models.FloatField()
    link_reporte = models.URLField(blank=True, null=True)
