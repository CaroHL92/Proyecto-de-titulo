from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    TIPO_USUARIO = [
        ('nino', 'Niño/Adolescente'),
        ('fonoaudiologo', 'Fonoaudiólogo'),
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_USUARIO, default='nino')
