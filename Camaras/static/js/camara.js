// MANEJAR LAS CATEGORIAS Y SU FILTRADO
document.addEventListener('DOMContentLoaded', function () {
    // Manejar cambios en los select
    document.querySelectorAll('select').forEach(function (select) {
        select.addEventListener('change', function () {
            // Obtener los valores seleccionados
            var tipo = document.getElementById('camaras_tipo').value;
            var precio = document.getElementById('camaras_precio').value;
            var marca = document.getElementById('camaras_marca').value;
            var resolucion = document.getElementById('camaras_resolucion').value;

            // Filtrar los elementos de la lista basados en las selecciones
            document.querySelectorAll('.imagen-camara').forEach(function (item) {
                var camaraTipo = item.getAttribute('data-tipo');
                var camaraPrecio = item.getAttribute('data-precio');
                var camaraMarca = item.getAttribute('data-marca');
                var camaraResolucion = item.getAttribute('data-resolucion');

                // Verificar si coincide con las selecciones
                var precioMin = 0, precioMax = Infinity;

                if (precio) {
                    var rango = precio.split('-');
                    precioMin = parseFloat(rango[0]);
                    precioMax = parseFloat(rango[1]);
                }

                if ((!tipo || camaraTipo === tipo) &&
                    (camaraPrecio >= precioMin && camaraPrecio < precioMax) &&
                    (!marca || camaraMarca === marca) &&
                    (!resolucion || camaraResolucion === resolucion)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // MANEJAR EL SELECTOR Y CONTADOR DE LAS CAMARAS
    const camarasSeleccionadas = {};
    const angulosVisiones = []; 
    let infoCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    console.log('Carrito inicial:', infoCarrito);

    // Función para actualizar el carrito
    function actualizarCarrito(camaraId, cantidad) {
        console.log('Entrando a actualizarCarrito:', { camaraId, cantidad });
        
        const camaraElemento = document.querySelector(`.imagen-camara[data-id="${camaraId}"]`);
        if (!camaraElemento) {
            console.error('No se encontró el elemento de la cámara');
            return;
        }

        try {
            const existingIndex = infoCarrito.findIndex(item => item.id === camaraId);
            console.log('Índice existente:', existingIndex);
            
            if (cantidad > 0) {
                const infoCamara = {
                    id: camaraId,
                    nombre: camaraElemento.querySelector('.nombre-camara').textContent,
                    precio: parseFloat(camaraElemento.getAttribute('data-precio')),
                    marca: camaraElemento.getAttribute('data-marca'),
                    resolucion: camaraElemento.getAttribute('data-resolucion'),
                    cantidad: cantidad,
                    imagen: camaraElemento.querySelector('img').src
                };
                console.log('Info cámara preparada:', infoCamara);

                if (existingIndex !== -1) {
                    infoCarrito[existingIndex] = infoCamara;
                } else {
                    infoCarrito.push(infoCamara);
                }
            } else if (existingIndex !== -1) {
                infoCarrito.splice(existingIndex, 1);
            }

            localStorage.setItem('carrito', JSON.stringify(infoCarrito));
            console.log('Carrito actualizado:', infoCarrito);
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
        }
    }


    // Botón agregar
    document.querySelectorAll('.btn-agregar').forEach(button => {
        button.addEventListener('click', () => {
            const camaraId = button.getAttribute('data-id');
            console.log('Botón agregar clickeado - ID:', camaraId);
            
            const contador = document.getElementById(`contador-${camaraId}`);
            const camaraElemento = document.querySelector(`.imagen-camara[data-id="${camaraId}"]`);

            if (!camaraElemento) {
                console.error('No se encontró el elemento de la cámara');
                return;
            }

            // Actualizar contador
            camarasSeleccionadas[camaraId] = (camarasSeleccionadas[camaraId] || 0) + 1;
            contador.textContent = camarasSeleccionadas[camaraId];
            
            // Actualizar ángulos
            const anguloVision = camaraElemento.dataset.anguloVision;
            angulosVisiones.push(anguloVision);
            console.log(`Ángulo de visión agregado para la cámara ID ${camaraId}: ${anguloVision}`);
            
            // Actualizar carrito
            actualizarCarrito(camaraId, camarasSeleccionadas[camaraId]);
        });
    });

    // Botón eliminar
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            const camaraId = button.getAttribute('data-id');
            console.log('Botón eliminar clickeado - ID:', camaraId);
            
            if (camarasSeleccionadas[camaraId]) {
                const camaraElemento = document.querySelector(`.imagen-camara[data-id="${camaraId}"]`);
                const contador = document.getElementById(`contador-${camaraId}`);
                
                if (!camaraElemento) {
                    console.error('No se encontró el elemento de la cámara');
                    return;
                }

                const anguloVision = camaraElemento.dataset.anguloVision;
                camarasSeleccionadas[camaraId] -= 1;

                if (camarasSeleccionadas[camaraId] < 0) {
                    camarasSeleccionadas[camaraId] = 0;
                }

                contador.textContent = camarasSeleccionadas[camaraId];
                
                // Actualizar ángulos
                const index = angulosVisiones.indexOf(anguloVision);
                if (index > -1) {
                    angulosVisiones.splice(index, 1);
                    console.log(`Ángulo de visión eliminado para la cámara ID ${camaraId}: ${anguloVision}`);
                }

                // Actualizar carrito
                actualizarCarrito(camaraId, camarasSeleccionadas[camaraId]);
            }
        });
    });

    // MANEJAR EL ENVIO DE LOS DATOS DE LAS CAMARAS SELECCIONADAS
    document.getElementById('siguiente').addEventListener('click', () => {
        const angulosString = angulosVisiones.join(',');

        // Redirigir a la siguiente vista
        if (angulosVisiones.length > 0) {
            window.location.href = `/planos?angulos=${encodeURIComponent(angulosString)}`;
        } else {
            alert("Por favor, selecciona al menos una cámara.");
        }
    });
});

console.log('Carrito inicial desde localStorage:', localStorage.getItem('carrito'));