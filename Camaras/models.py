from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Camara(models.Model):
    TIPOS_CAMARA = [
        ('interior', 'Interior'),
        ('exterior', 'Exterior'),
    ]
    #  Atributo para el tipo de cámara, con opciones predefinidas "interior" y "exterior"
    tipo = models.CharField(max_length=10, choices=TIPOS_CAMARA)

    # Atributo para el nombre de la cámara
    nombre = models.CharField(max_length=100, default="Camara")

    # Atributo para el precio, puedes usar un campo Decimal o FloatField para almacenar valores numéricos.
    precio = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    # Atributo para la marca de la cámara.
    marca = models.CharField(max_length=100)

    # Atributo para la resolución de la cámara (acepta valores numéricos enteros)
    resolucion = models.IntegerField(default=720)

    camara = models.ImageField(upload_to='camaras/', null=False, blank=True)

    # Atributo para el ángulo de visión, puedes usar un campo Decimal o FloatField para almacenar valores numéricos.
    angulo_vision = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(360)], default=90.00)


    def __str__(self):
        return f"{self.marca} - {self.tipo} - {self.resolucion}p"
