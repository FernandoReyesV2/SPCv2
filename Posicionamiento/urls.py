from django.urls import path
from . import views  # Cambia la importación

urlpatterns = [
    path('', views.posicionCamaras, name='posicionCamaras'),
    path('guardar-imagen/', views.guardar_imagen, name='guardar_imagen'),
]