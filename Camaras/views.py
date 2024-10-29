from django.shortcuts import render
from .models import Camara

def camaras_view(request):
    # imágenes
    camaras = Camara.objects.all()
    # interior o exterior
    categorias_tipo = Camara.TIPOS_CAMARA
    # precios
    categorias_precio = Camara.objects.values_list('precio', flat=True).distinct()
    # rango de precios para filtro
    rangos_precio = [(0, 20), (20, 40), (40, 60), (60, 80), (80, 100)]
    # marca
    categorias_marca = Camara.objects.values_list('marca', flat=True).distinct()
    # resolución
    categorias_resolucion = Camara.objects.values_list('resolucion', flat=True).distinct()
    # nombre
    categorias_nombre = Camara.objects.values_list('nombre', flat=True).distinct()
    # ángulo de visión
    angulo_vision = Camara.objects.values_list('angulo_vision', flat=True).distinct()

    context = {
        'camaras': camaras,
        'categorias_nombre': categorias_nombre,
        'categorias_tipo': categorias_tipo,
        'categorias_precio': categorias_precio,
        'categorias_marca': categorias_marca,
        'categorias_resolucion': categorias_resolucion,
        'rangos_precio': rangos_precio,
        'angulo_vision': angulo_vision,
    }
    return render(request, 'camaras.html', context)
