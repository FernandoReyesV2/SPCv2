    document.getElementById('siguiente').addEventListener('click', function() {
        // Obtiene los valores de los campos de entrada
        const altura = document.getElementById('altura').value;
        const anchura = document.getElementById('anchura').value;
        const habitacion = document.getElementById('habitaciones-select');
        const habitacionValue = habitacion.value;

        // Obtiene los parámetros de la URL actual
        const currentUrl = new URL(window.location.href);
        const params = new URLSearchParams(currentUrl.search);

        // Mantén los valores actuales de la URL y agrega los nuevos valores de altura, anchura y habitación
        if (altura) {
            params.set('altura', altura);
        }
        if (anchura) {
            params.set('anchura', anchura);
        }
        if (habitacionValue) {
            params.set('habitacion', habitacionValue);
        }
        
        // Redirige a la nueva URL con los parámetros actualizados
        window.location.href = `/posicionamiento/?${params.toString()}`;
    });