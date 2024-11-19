from django.shortcuts import render
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os
from django.conf import settings
from datetime import datetime
import matplotlib.image as mpimg
from urllib.parse import unquote
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
import json
from .models import ImagenGuardada
from random import choice

def posicionCamaras(request):
    habitacion = unquote(request.GET.get('habitacion'))
    angulos = request.GET.get('angulos', 'No especificado')
    altura = float(request.GET.get('altura', 0))  # Convertir a entero
    anchura = float(request.GET.get('anchura', 0))  # Convertir a entero

    # Construcción de la URL de la imagen
    habitacion_image_url = os.path.join('Planos\static\images\habitaciones', f'{habitacion}.png')

    # Verificar si el archivo existe
    if os.path.exists(habitacion_image_url):
        print("El archivo existe.", habitacion_image_url)
    else:
        print("El archivo no existe.", habitacion_image_url)

    #Angulo
    anguloVision = [float(a) for a in angulos.split(',')] if angulos != 'No especificado' else []

    # Vertice inicial
    vertice = (0, 0)

    #Medidas
    medidas = [altura, anchura]

    # Puntos para graficar la habitacion
    vertices_cuadrilatero = [(0, 0), (0, medidas[1]), (medidas[0], medidas[1]), (medidas[0], 0)]

    # Colors for each sector
    sector_colors = ['red', 'green', 'blue', 'orange']

    contador = 0

    # Genera un nombre de archivo único con la marca de tiempo
    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
    image_filename = f"posicionCamaras_{timestamp_str}.png"

    # Ruta donde se guardará la imagen del gráfico
    image_path = os.path.join(settings.MEDIA_ROOT, 'grafico', image_filename)

    # Asegúrate de que la carpeta de destino exista
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    # Pasa la ruta de la imagen como contexto a la función render
    context = {
        'image_path': os.path.join(settings.MEDIA_URL, 'grafico', image_filename),
    }

    # Configuracion del Grafico
    fig, ax = plt.subplots()

    # Mostrar la imagen como fondo
    img = mpimg.imread(habitacion_image_url)  # Cargar la imagen
    ax.imshow(img, extent=[0, medidas[0], 0, medidas[1]], aspect='auto')  # Establecer la imagen como fondo

    # Ocultar los ejes
    ax.axis('off')

    # Graficar el cuadrilátero
    x, y = zip(*vertices_cuadrilatero)
    plt.plot(x + (x[0],), y + (y[0],), 'k-')
    plt.fill(x, y, alpha=0.2, color='gray')

    # plt.title('Posicion Optima Cámara')
    plt.axis('equal')

    numeros_disponibles = [1, 2, 3, 4]  # Lista inicial de números disponibles
    
    for angulo, color in zip(anguloVision, sector_colors):
        contador = choice(numeros_disponibles)  # Selecciona un número aleatorio
        numeros_disponibles.remove(contador)    # Elimina el número usado
        
        if contador == 1:
            if angulo > 90:
                vertice = (medidas[0] / 2, 0)
            else:
                vertice = (0, 0)
        elif contador == 2:
            if angulo > 90:
                vertice = (0, medidas[1] / 2)
            else:
                vertice = (0, medidas[1])
        elif contador == 3:
            if angulo > 90:
                vertice = (medidas[0] / 2, medidas[1])
            else:
                vertice = (medidas[0], medidas[1])
        elif contador == 4:
            if angulo > 90:
                vertice = (medidas[0], medidas[1] / 2)
            else:
                vertice = (medidas[0], 0)
        Calcular(vertice, angulo, contador, color, medidas)

    # Guardar la figura en un archivo
    plt.savefig(image_path)

    plt.close()

    return render(request, 'posicionCamaras.html', context)

def calcular_angulo_entre_puntos(angulo, contador):
    # sector 1
    if contador == 1:
        if angulo < 90:
            angulo_deg = 45 - angulo / 2
        elif angulo == 90:
            angulo_deg = 0
        else:
            angulo_deg = 90 - angulo / 2
    # sector 2
    elif contador == 2:
        if angulo < 90:
            angulo_deg = (315 - angulo / 2)
        elif angulo == 90:
            angulo_deg = 270
        else:
            angulo_deg = (360 - angulo / 2)
    # sector 3
    elif contador == 3:
        if angulo < 90:
            angulo_deg = (225 - angulo / 2)
        elif angulo == 90:
            angulo_deg = 180
        else:
            angulo_deg = (270 - angulo / 2)
    # sector 4
    elif contador == 4:
        if angulo < 90:
            angulo_deg = (135 - angulo / 2)
        elif angulo == 90:
            angulo_deg = 90
        else:
            angulo_deg = (180 - angulo / 2)
    else:
        angulo_deg = 0

    return angulo_deg

# Grafica el rango de visión como un sector circular y el cuadrilátero
def Calcular(vertice, angulo, contador, color, medidas):
    angulo_inicial = calcular_angulo_entre_puntos(angulo, contador)
    sector_radius = medidas[0] / 2
    sector = patches.Wedge(vertice, sector_radius, angulo_inicial, angulo_inicial + angulo, alpha=0.2, color=color)
    plt.gca().add_patch(sector)

    # Posicion de las camaras
    plt.scatter(vertice[0], vertice[1], color='black', marker='o')

@require_POST
@login_required
def guardar_imagen(request):
    try:
        data = json.loads(request.body)
        imagen_url = data.get('imagen_url')
        
        if not imagen_url:
            return JsonResponse({
                'success': False, 
                'error': 'No se proporcionó URL de imagen'
            })
            
        ImagenGuardada.objects.create(
            usuario=request.user,
            imagen_url=imagen_url
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Imagen guardada correctamente'
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': 'Error en el formato JSON'
        })
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': f'Error inesperado: {str(e)}'
        })