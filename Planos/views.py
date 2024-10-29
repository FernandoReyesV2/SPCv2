from django.shortcuts import render

def planos_view(request):
    angulos = request.GET.get('angulos', '')
    lista_angulos = angulos.split(',') if angulos else []

    return render(request, 'planos.html', {
        'angulos': lista_angulos,
    })
