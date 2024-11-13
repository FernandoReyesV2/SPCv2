from django.contrib import admin
from .models import ImagenGuardada

@admin.register(ImagenGuardada)
class ImagenGuardadaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'imagen_url', 'fecha_guardado')
    list_filter = ('usuario', 'fecha_guardado')
    search_fields = ('usuario__username', 'imagen_url')
    readonly_fields = ('fecha_guardado',)