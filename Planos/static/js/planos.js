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

            // Aplicar preprocesamiento a la imagen (escala de grises y escalado)
            applyGrayscaleAndScale(img.src, 2).then(processedImageSrc => {
                const uploadedImage = document.getElementById('uploaded-image');
                uploadedImage.src = processedImageSrc;
                uploadedImage.style.display = 'block';

                console.log("Inicio de reconocimiento");

                Tesseract.recognize(
                    processedImageSrc,
                    'eng',
                    {
                        logger: info => console.log(info),
                        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK // Cambiar a un modo de página adecuado
                    }
                ).then(({ data: { text } }) => {
                    console.log('Texto reconocido:', text);
                    console.log("Fin de reconocimiento");

                    const recognizedNumbers = text.match(/\d+/g);
                    console.log('Números reconocidos:', recognizedNumbers);

                    if (recognizedNumbers) {
                        document.getElementById('anchura').value = recognizedNumbers[0] || '';
                        document.getElementById('altura').value = recognizedNumbers[1] || '';
                    } else {
                        document.getElementById('anchura').value = '';
                        document.getElementById('altura').value = '';
                    }
                }).catch(error => {
                    console.error('Error al reconocer la imagen:', error);
                    console.log("Fin de reconocimiento");
                });
            });
        };
    };

    reader.readAsDataURL(file);
}

// Función para convertir la imagen a escala de grises y escalar
function applyGrayscaleAndScale(src, scaleFactor) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const imgElement = new Image();
        imgElement.src = src;

        imgElement.onload = function() {
            // Escalar la imagen
            canvas.width = imgElement.width * scaleFactor;
            canvas.height = imgElement.height * scaleFactor;
            context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Convertir a escala de grises
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;     // Rojo
                data[i + 1] = avg; // Verde
                data[i + 2] = avg; // Azul
            }

            context.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL()); // Devuelve la imagen en escala de grises
        };
    });
}
