document.getElementById('siguiente').addEventListener('click', function () {
    // Obtiene los valores de los campos de entrada
    const altura = document.getElementById('altura').value;
    const anchura = document.getElementById('anchura').value;
    const habitacion = document.getElementById('habitaciones-select');
    const habitacionValue = habitacion.value;

    // Validaciones
    if (!altura || altura.trim() === '' || altura < 0 || altura > 100) {
        alert('Por favor, ingresa una altura válida (entre 0 y 100).');
        return; // Detiene la ejecución si la validación falla
    }

    if (!anchura || anchura.trim() === '' || anchura < 0 || anchura > 100) {
        alert('Por favor, ingresa una anchura válida (entre 0 y 100).');
        return; // Detiene la ejecución si la validación falla
    }

    if (!habitacionValue) {
        alert('Por favor, selecciona una habitación.');
        return; // Detiene la ejecución si la validación falla
    }

    // Obtiene los parámetros de la URL actual
    const currentUrl = new URL(window.location.href);
    const params = new URLSearchParams(currentUrl.search);

    // Mantén los valores actuales de la URL y agrega los nuevos valores de altura, anchura y habitación
    params.set('altura', altura);
    params.set('anchura', anchura);
    params.set('habitacion', habitacionValue);

    // Redirige a la nueva URL con los parámetros actualizados
    window.location.href = `/posicionamiento/?${params.toString()}`;
});

function mostrarImagenHabitacion() {
    const select = document.getElementById('habitaciones-select');
    const selectedValue = select.value;
    const imageContainer = document.getElementById('uploaded-image');

    if (selectedValue) {
        // Construir la ruta de la imagen basada en la selección
        imageContainer.src = `/static/images/habitaciones/${selectedValue}.png`;
        console.log(imageContainer);
        imageContainer.style.display = 'block';
    } else {
        imageContainer.style.display = 'none';
    }
}
