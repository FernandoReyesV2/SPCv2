# Main/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from .views import home_view, login_view, logout_view, register_view, mis_planos_view, factura_view, eliminar_plano

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('mis_planos/', mis_planos_view, name='mis_planos'),
    path('camaras/', include('Camaras.urls')),
    path('planos/', include('Planos.urls')),
    path('posicionamiento/', include('Posicionamiento.urls')),
    path('factura/', factura_view, name='factura'),
    path('eliminar_plano/', eliminar_plano, name='eliminar_plano'),
]

if settings.DEBUG:  # Solo en modo desarrollo
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)