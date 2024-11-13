from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from Posicionamiento.models import ImagenGuardada 
from Camaras.models import Camara
import json
from django.views.decorators.http import require_POST
from django.http import JsonResponse 
def home_view(request):
    return render(request, 'home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')  # o donde quieras redirigir después del login
        else:
            # Intentamos encontrar si el usuario existe
            if User.objects.filter(username=username).exists():
                # El usuario existe, entonces la contraseña es incorrecta
                form = {'password': {'errors': ['La contraseña es incorrecta']}}
            else:
                # El usuario no existe
                form = {'username': {'errors': ['El usuario no existe']}}
            
            return render(request, 'login.html', {'form': form})
    
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('home')

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        form = {}
        
        # Validaciones
        if User.objects.filter(username=username).exists():
            form['username'] = {'errors': ['Este nombre de usuario ya está en uso']}
        
        if User.objects.filter(email=email).exists():
            form['email'] = {'errors': ['Este correo electrónico ya está registrado']}
            
        if password1 != password2:
            form['password2'] = {'errors': ['Las contraseñas no coinciden']}
            
        if len(password1) < 5:
            form['password1'] = {'errors': ['La contraseña debe tener al menos 5 caracteres']}
            
        # Si hay errores, volver al formulario con los mensajes
        if form:
            return render(request, 'register.html', {'form': form})
            
        # Si no hay errores, crear el usuario
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1
            )
            # Iniciar sesión automáticamente después del registro
            login(request, user)
            return redirect('home')
            
        except Exception as e:
            form['username'] = {'errors': ['Error al crear el usuario. Por favor, intente nuevamente.']}
            return render(request, 'register.html', {'form': form})
    
    return render(request, 'register.html')

@login_required
def mis_planos_view(request):  # Cambiamos el nombre aquí
    imagenes_guardadas = ImagenGuardada.objects.filter(usuario=request.user).order_by('-fecha_guardado')
    return render(request, 'mis_planos.html', {
        'imagenes_guardadas': imagenes_guardadas
    })

def factura_view(request):
    # Aquí procesarías la información del carrito
    facturas = []
    total = 0
    
    return render(request, 'factura.html', {
        'facturas': facturas,
        'total': total
    })

@require_POST
def eliminar_plano(request):
    try:
        data = json.loads(request.body)
        imagen_id = data.get('imagen_id')
        
        # Obtén y elimina la imagen
        imagen = ImagenGuardada.objects.get(id=imagen_id, usuario=request.user)
        imagen.delete()
        
        return JsonResponse({'mensaje': 'Plano eliminado correctamente'})
    except ImagenGuardada.DoesNotExist:
        return JsonResponse({'error': 'Imagen no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)