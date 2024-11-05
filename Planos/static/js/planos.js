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

// Función para reconocer números
function reconocerNumeros() {
    const fileInput = document.getElementById('file-upload');

    // Asegúrate de que hay un archivo cargado
    if (fileInput.files.length > 0) {
        handleImageUpload({ target: { files: [fileInput.files[0]] } });

        // Lógica de reconocimiento de números
        const processedImageSrc = fileInput.files[0]; // Se debe asegurar que esto apunte a la imagen procesada
        Tesseract.recognize(
            processedImageSrc,
            'eng',
            {
                logger: info => console.log(info),
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK
            }
        ).then(({ data: { text } }) => {
            console.log('Texto reconocido:', text);
            const recognizedNumbers = text.match(/\d+/g);
            if (recognizedNumbers) {
                document.getElementById('anchura').value = recognizedNumbers[0] || '';
                document.getElementById('altura').value = recognizedNumbers[1] || '';
            } else {
                document.getElementById('anchura').value = '';
                document.getElementById('altura').value = '';
            }
        }).catch(error => {
            console.error('Error al reconocer la imagen:', error);
        });
    } else {
        alert('Por favor, selecciona una imagen primero.');
    }
}

// Asignar eventos a los botones
document.getElementById('reconocer-numeros').addEventListener('click', reconocerNumeros);
