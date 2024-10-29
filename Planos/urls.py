# Planos/urls.py

from django.urls import path
from .views import planos_view

urlpatterns = [
    path('', planos_view, name='planos'),  # La URL raíz de la aplicación Camaras
]
