// ELEMENTOS DEL DOM
const reservaForm = document.getElementById('reservaForm');
const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');
const confirmationModal = document.getElementById('confirmationModal');
const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');
const confirmationOverlay = document.getElementById('confirmationOverlay');
const confirmationText = document.getElementById('confirmationText');
const prendaReservada = document.getElementById('prendaReservada');

// NÚMERO DE WHATSAPP
const WHATSAPP_NUMBER = "51994327093";

// DATOS DE LA ÚLTIMA RESERVA (si viene de prendas.html)
let ultimaReserva = null;

// FUNCIONES

// Cargar datos de la reserva anterior
function cargarDatosReserva() {
    const reservaData = localStorage.getItem('ultimaReserva');
    if (reservaData) {
        ultimaReserva = JSON.parse(reservaData);
        mostrarPrendaReservada();
        
        // Limpiar localStorage después de mostrar
        setTimeout(() => {
            localStorage.removeItem('ultimaReserva');
        }, 5000);
    }
}

// Mostrar información de la prenda reservada
function mostrarPrendaReservada() {
    if (!ultimaReserva) return;
    
    prendaReservada.classList.add('active');
    prendaReservada.innerHTML = `
        <div class="prenda-reservada-header">
            <img src="${ultimaReserva.imagen}" alt="${ultimaReserva.nombre}" class="prenda-reservada-img">
            <div class="prenda-reservada-info">
                <h3>${ultimaReserva.nombre}</h3>
                <p>${ultimaReserva.precio} | Talla: ${ultimaReserva.talla}</p>
                <p><strong>Estás en lista de espera para esta prenda</strong></p>
            </div>
        </div>
        <p>Ingresa tu correo para recibir notificación cuando esté disponible.</p>
    `;
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Enviar a WhatsApp
function enviarWhatsApp(email) {
    // Mensaje para WhatsApp
    let mensaje = `*NUEVA RESERVA DENIM TEARS*%0A`;
    mensaje += `Correo: ${email}%0A`;
    mensaje += `Fecha: ${new Date().toLocaleDateString('es-PE')}%0A`;
    
    if (ultimaReserva) {
        mensaje += `%0A*PRENDA RESERVADA:*%0A`;
        mensaje += `- ${ultimaReserva.nombre}%0A`;
        mensaje += `- ${ultimaReserva.precio}%0A`;
        mensaje += `- Talla: ${ultimaReserva.talla}`;
    } else {
        mensaje += `%0A*LISTA DE ESPERA GENERAL*%0A`;
        mensaje += `Usuario quiere recibir información sobre nuevos drops.`;
    }
    
    // Crear URL de WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(url, '_blank');
    
    // También guardar en localStorage para registro
    guardarRegistroEmail(email);
}

// Guardar registro de email
function guardarRegistroEmail(email) {
    // Obtener registros existentes
    let registros = JSON.parse(localStorage.getItem('reservasEmails')) || [];
    
    // Agregar nuevo registro
    registros.push({
        email: email,
        fecha: new Date().toISOString(),
        prenda: ultimaReserva ? ultimaReserva.nombre : 'Lista General'
    });
    
    // Guardar (limitado a 50 registros)
    if (registros.length > 50) {
        registros = registros.slice(-50);
    }
    
    localStorage.setItem('reservasEmails', JSON.stringify(registros));
}

// Mostrar confirmación
function mostrarConfirmacion(email) {
    // Actualizar texto de confirmación
    if (ultimaReserva) {
        confirmationText.innerHTML = `
            Te notificaremos cuando <strong>${ultimaReserva.nombre}</strong> esté disponible.<br>
            Revisa tu correo <strong>${email}</strong> para más información.
        `;
    } else {
        confirmationText.innerHTML = `
            Te hemos agregado a nuestra lista de espera.<br>
            Recibirás información en <strong>${email}</strong> sobre nuevos drops.
        `;
    }
    
    // Mostrar modal
    confirmationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar confirmación
function cerrarConfirmacion() {
    confirmationModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar formulario
    emailInput.value = '';
    
    // Habilitar botón
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'AGREGARME A LA LISTA';
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de reservas cargada');
    
    // Cargar datos de reserva si existen
    cargarDatosReserva();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Evento submit del formulario
    reservaForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validar email
        if (!validarEmail(email)) {
            alert('Por favor ingresa un correo electrónico válido.');
            emailInput.focus();
            return;
        }
        
        // Deshabilitar botón mientras procesa
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'PROCESANDO...';
        
        // Simular procesamiento (en un caso real sería una petición a un servidor)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
            // 1. Enviar a WhatsApp
            enviarWhatsApp(email);
            
            // 2. Mostrar confirmación
            mostrarConfirmacion(email);
            
            // 3. (OPCIONAL) Aquí iría el envío a tu backend
            // await enviarEmailABackend(email);
            
        } catch (error) {
            console.error('Error al procesar la reserva:', error);
            alert('Hubo un error al procesar tu reserva. Intenta nuevamente.');
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'AGREGARME A LA LISTA';
        }
    });
    
    // Cerrar modal de confirmación
    closeConfirmationBtn.addEventListener('click', cerrarConfirmacion);
    confirmationOverlay.addEventListener('click', cerrarConfirmacion);
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
            cerrarConfirmacion();
        }
    });
    
    // Efecto de focus en input
    emailInput.addEventListener('focus', function() {
        this.parentElement.querySelector('.input-line').style.background = '#000';
    });
    
    emailInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.parentElement.querySelector('.input-line').style.background = '#ddd';
        }
    });
    
    // Validación en tiempo real
    emailInput.addEventListener('input', function() {
        const isValid = validarEmail(this.value.trim());
        const inputLine = this.parentElement.querySelector('.input-line');
        
        if (this.value.trim() === '') {
            inputLine.style.background = '#ddd';
        } else if (isValid) {
            inputLine.style.background = '#25D366'; // Verde si es válido
        } else {
            inputLine.style.background = '#ff4444'; // Rojo si no es válido
        }
    });
    
    // Función para actualizar contador del carrito (desde prendas.js)
    function actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            cartCount.textContent = carrito.length;
        }
    }
    
    // Estilos adicionales
    const style = document.createElement('style');
    style.textContent = `
        .prenda-reservada-info p {
            margin: 5px 0;
        }
        
        .prenda-reservada-info strong {
            color: #000;
        }
        
        .submit-btn i {
            transition: transform 0.3s ease;
        }
        
        .submit-btn:hover i {
            transform: translateX(5px);
        }
        
        .email-input.error {
            color: #ff4444;
        }
        
        .whatsapp-btn i {
            font-size: 18px;
        }
        
        .whatsapp-confirm i {
            font-size: 18px;
        }
    `;
    document.head.appendChild(style);
});
