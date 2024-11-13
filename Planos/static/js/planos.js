// Asignar el evento al input de carga de archivos
document.getElementById('file-upload').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            // Verificar el tamaño de la imagen
            if (img.width < 100 || img.height < 100) {
                console.error('La imagen es demasiado pequeña para procesarla.');
                alert('Por favor, carga una imagen con un tamaño mayor a 100x100 píxeles.');
                return;
            }

            // Mostrar la imagen subida
            const uploadedImage = document.getElementById('uploaded-image');
            uploadedImage.src = img.src;
            uploadedImage.style.display = 'block';
        };
    };

    reader.readAsDataURL(file);
}

// Función para convertir la imagen a escala de grises y ajustar el contraste
function preprocessImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Obtener los datos de la imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convertir a escala de grises y ajustar el contraste
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const contrast = 1.5; // Ajusta este valor según sea necesario
        const newValue = (avg - 128) * contrast + 128;
        data[i] = data[i + 1] = data[i + 2] = newValue; // Escala de grises
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

// Función para reconocer números
function reconocerNumeros() {
    const image = document.getElementById('uploaded-image');

    // Asegúrate de que la imagen esté visible
    if (image.style.display !== 'none') {
        const preprocessedImageSrc = preprocessImage(image);

        // Lógica de reconocimiento de números
        Tesseract.recognize(
            preprocessedImageSrc,
            'eng+spa', // Reconocer en inglés y español
            {
                logger: info => console.log(info),
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE // Prueba con diferentes modos
            }
        ).then(({ data: { text } }) => {
            console.log('Texto reconocido:', text);

            // Extraer solo los números, incluyendo decimales
            const recognizedNumbers = text.match(/\d+(\.\d+)?/g);
            if (recognizedNumbers && recognizedNumbers.length > 0) {
                document.getElementById('anchura').value = recognizedNumbers[0] || '';
                document.getElementById('altura').value = recognizedNumbers[1] || '';
            } else {
                document.getElementById('anchura').value = '';
                document.getElementById('altura').value = '';
                alert('No se encontraron medidas. Por favor, ingrese las medidas manualmente.');
            }
        }).catch(error => {
            console.error('Error al reconocer la imagen', error);
        });
    } else {
        alert('Por favor, sube una imagen primero.');
    }
}
// Asignar eventos a los botones
document.getElementById('reconocer-numeros').addEventListener('click', reconocerNumeros);
