// Obtener el total de la factura desde el HTML (asegúrate de que esté presente)
const totalAmount = parseFloat(document.querySelector('.total').innerText.replace('Total: $', ''));

// Configuración del botón de PayPal
paypal.Buttons({
    // Crear la orden de pago
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalAmount.toFixed(2) // Usa el total de la factura
                }
            }]
        });
    },

    // Captura la orden de pago después de la aprobación
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Pago realizado con éxito por ' + details.payer.name.given_name);
            // Aquí puedes redirigir al usuario a una página de confirmación o realizar cualquier acción adicional
            // Por ejemplo, enviar los datos de la compra al backend para guardar la factura
            window.location.href = "/factura/confirmacion";
        });
    },

    // Manejar un error en el proceso de pago
    onError: function(err) {
        console.error('Error durante el pago con PayPal:', err);
        alert('Hubo un error al procesar el pago. Intenta nuevamente.');
    }
}).render('#paypal-button-container'); // Renderiza el botón en el contenedor