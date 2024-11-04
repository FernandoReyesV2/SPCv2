# Planos/urls.py

from django.urls import path
from .views import posicionCamaras

urlpatterns = [
    path('', posicionCamaras, name='posicionCamaras'),  # La URL raíz de la aplicación Camaras
]
