# Camaras/urls.py

from django.urls import path
from .views import camaras_view

urlpatterns = [
    path('', camaras_view, name='camaras'),  # La URL raíz de la aplicación Camaras
]
