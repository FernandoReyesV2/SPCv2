import cv2
import os
from django.shortcuts import render
from django.http import HttpResponse
from ultralytics import YOLO

def planos_view(request):
    angulos = request.GET.get('angulos', '')
    lista_angulos = angulos.split(',') if angulos else []
    habitaciones_detectadas = []
    contador_habitaciones = {}

    if request.method == 'POST':
        if 'image' in request.FILES:
            uploaded_file = request.FILES['image']
            image_path = os.path.join('Planos/static/images/habitaciones',
                                      uploaded_file.name)  # Define la ruta donde guardarás la imagen

            # Guardar la imagen subida
            with open(image_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            # Cargar el modelo entrenado
            model = YOLO(
                'Planos/static/model/best.pt'
            )

            # Leer la imagen desde el archivo
            imagen = cv2.imread(image_path)
            if imagen is None:
                return HttpResponse("Error al cargar la imagen", status=400)

            # Realizar la predicción en la imagen
            results = model.predict(source=imagen, imgsz=640, conf=0.6)

            # Extraer habitaciones detectadas
            for result in results:
                for detection in result.boxes.data.numpy():
                    # Extraer información de la detección
                    x1, y1, x2, y2, confidence, class_id = detection
                    class_labels = {
                        0: "bano",
                        1: "cocina",
                        2: "comedor",
                        3: "dormitorio",
                        4: "garaje",
                        5: "oficina",
                        6: "sala principal",
                    }
                    room_label = class_labels.get(int(class_id), "desconocido")
                    # Contar las habitaciones y numerarlas
                    if room_label not in contador_habitaciones:
                        contador_habitaciones[room_label] = 1
                    else:
                        contador_habitaciones[room_label] += 1

                    # Crear el nombre de la habitación numerada
                    habitaciones_detectadas.append(f"{room_label} {contador_habitaciones[room_label]}")

    # Renderizar la plantilla con los ángulos y las habitaciones detectadas
    return render(request, 'planos.html', {
        'angulos': lista_angulos,
        'habitaciones_detectadas': list(set(habitaciones_detectadas)),  # Evitar duplicados si lo deseas
    })
