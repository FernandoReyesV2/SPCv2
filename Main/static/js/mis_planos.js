function descargarImagen(button) {
    const imagenUrl = button.getAttribute('data-imagen-url');
    
    // Crear un elemento <a> temporal
    const link = document.createElement('a');
    link.href = imagenUrl;
    link.download = 'plano_' + new Date().getTime() + '.png'; // Nombre del archivo
    
    // Agregar el link al documento
    document.body.appendChild(link);
    
    // Simular click
    link.click();
    
    // Remover el link
    document.body.removeChild(link);
}

function eliminarPlano(button) {
    if (confirm('¿Estás seguro de que deseas eliminar este plano?')) {
        const imagenId = button.getAttribute('data-imagen-id');
        
        fetch('/eliminar_plano/', {  // Cambiado de eliminar-plano a eliminar_plano
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'imagen_id': imagenId
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error al eliminar el plano');
                });
            }
            return response.json();
        })
        .then(data => {
            // Eliminar la card del DOM
            button.closest('.imagen-card').remove();
            
            // Si no quedan más imágenes, mostrar mensaje
            if (document.querySelectorAll('.imagen-card').length === 0) {
                document.querySelector('.imagenes-guardadas').innerHTML = 
                    '<p>No tienes planos guardados aún.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al eliminar el plano: ' + error.message);
        });
    }
}

// Función auxiliar para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}