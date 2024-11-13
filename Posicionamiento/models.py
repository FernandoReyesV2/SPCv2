from django.db import models
from django.contrib.auth.models import User

class ImagenGuardada(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen_url = models.URLField()
    fecha_guardado = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Imagen Guardada"
        verbose_name_plural = "Imágenes Guardadas"