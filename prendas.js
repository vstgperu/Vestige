// DATOS DE LAS PRENDAS
const prendasData = {
    1: {
        id: 1,
        nombre: "ANÓNIMO 01",
        precio: "$245.00 USD",
        imagen: "assets/prenda1.png",
        descripcion: "Hoodie de algodón premium con estampado frontal. Corte oversized, manga raglán. Edición limitada con solo 100 unidades disponibles mundialmente.",
        tallas: ["XS", "S", "M", "L", "XL"],
        color: "Negro",
        composicion: "100% Algodón",
        origen: "Hecho en Los Angeles, CA"
    },
    2: {
        id: 2,
        nombre: "ANÓNIMO 02",
        precio: "$198.00 USD",
        imagen: "assets/prenda2.png",
        descripcion: "T-shirt de corte boxy con gráfico screen-print. Algodón orgánico 240gsm. Cada pieza es numerada a mano.",
        tallas: ["S", "M", "L", "XL"],
        color: "Blanco hueso",
        composicion: "100% Algodón Orgánico",
        origen: "Hecho en USA"
    }
};

// ELEMENTOS DEL DOM
const detalleModal = document.getElementById('detalleModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const prendasGrid = document.getElementById('prendasGrid');

// VARIABLES
let tallaSeleccionada = null;
let prendaActualId = null;

// FUNCIONES

// Mostrar modal con detalles de prenda
function mostrarDetallePrenda(prendaId) {
    const prenda = prendasData[prendaId];
    if (!prenda) return;
    
    prendaActualId = prendaId;
    tallaSeleccionada = null;
    
    // Crear HTML del modal
    modalBody.innerHTML = `
        <div class="modal-imagen-container">
            <img src="${prenda.imagen}" alt="${prenda.nombre}" class="modal-imagen">
        </div>
        
        <div class="modal-info">
            <h2 class="modal-nombre">${prenda.nombre}</h2>
            <p class="modal-precio">${prenda.precio}</p>
            
            <p class="modal-descripcion">${prenda.descripcion}</p>
            
            <div class="detalles-adicionales">
                <div class="detalle-item">
                    <strong>Color:</strong> ${prenda.color}
                </div>
                <div class="detalle-item">
                    <strong>Composición:</strong> ${prenda.composicion}
                </div>
                <div class="detalle-item">
                    <strong>Origen:</strong> ${prenda.origen}
                </div>
            </div>
            
            <div class="talla-options">
                <h4>SELECCIONAR TALLA</h4>
                <div class="tallas" id="tallasContainer">
                    ${prenda.tallas.map(talla => `
                        <div class="talla-option" data-talla="${talla}">
                            ${talla}
                        </div>
                    `).join('')}
                </div>
                <p class="talla-mensaje" id="tallaMensaje"></p>
            </div>
            
            <div class="modal-buttons">
                <button class="reservar-btn" id="reservarBtn">
                    RESERVAR ESTA PRENDA
                </button>
                <button class="agregar-carrito-btn" id="agregarCarritoBtn">
                    AGREGAR AL CARRITO
                </button>
            </div>
        </div>
    `;
    
    // Mostrar modal
    detalleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Inicializar eventos del modal
    inicializarEventosModal();
}

// Cerrar modal
function cerrarModal() {
    detalleModal.classList.remove('active');
    document.body.style.overflow = '';
    tallaSeleccionada = null;
    prendaActualId = null;
}

// Inicializar eventos del modal
function inicializarEventosModal() {
    // Selección de tallas
    const tallasOptions = document.querySelectorAll('.talla-option');
    const tallaMensaje = document.getElementById('tallaMensaje');
    
    tallasOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior
            tallasOptions.forEach(t => t.classList.remove('selected'));
            
            // Seleccionar nueva talla
            this.classList.add('selected');
            tallaSeleccionada = this.dataset.talla;
            
            // Mostrar mensaje
            tallaMensaje.textContent = `Talla ${tallaSeleccionada} seleccionada`;
            tallaMensaje.style.color = '#000';
        });
    });
    
    // Botón reservar
    const reservarBtn = document.getElementById('reservarBtn');
    if (reservarBtn) {
        reservarBtn.addEventListener('click', function() {
            if (!tallaSeleccionada) {
                tallaMensaje.textContent = 'Por favor selecciona una talla';
                tallaMensaje.style.color = '#d00';
                return;
            }
            
            // Guardar datos en localStorage para la página de reservas
            const prenda = prendasData[prendaActualId];
            const reservaData = {
                prendaId: prendaActualId,
                nombre: prenda.nombre,
                precio: prenda.precio,
                talla: tallaSeleccionada,
                imagen: prenda.imagen,
                timestamp: Date.now()
            };
            
            localStorage.setItem('ultimaReserva', JSON.stringify(reservaData));
            
            // Redirigir a reservas
            cerrarModal();
            window.location.href = 'reservas.html';
        });
    }
    
    // Botón agregar al carrito
    const agregarCarritoBtn = document.getElementById('agregarCarritoBtn');
    if (agregarCarritoBtn) {
        agregarCarritoBtn.addEventListener('click', function() {
            if (!tallaSeleccionada) {
                tallaMensaje.textContent = 'Por favor selecciona una talla';
                tallaMensaje.style.color = '#d00';
                return;
            }
            
            // Obtener carrito actual
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            
            // Agregar nueva prenda
            const prenda = prendasData[prendaActualId];
            carrito.push({
                id: prendaActualId,
                nombre: prenda.nombre,
                precio: prenda.precio,
                talla: tallaSeleccionada,
                imagen: prenda.imagen
            });
            
            // Guardar carrito
            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            // Actualizar contador
            actualizarContadorCarrito();
            
            // Feedback al usuario
            alert(`${prenda.nombre} (Talla: ${tallaSeleccionada}) agregado al carrito`);
            cerrarModal();
        });
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = carrito.length;
        
        // Efecto visual
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de prendas cargada');
    
    // Actualizar contador del carrito al cargar
    actualizarContadorCarrito();
    
    // Eventos para las tarjetas de prendas
    const prendaCards = document.querySelectorAll('.prenda-card');
    prendaCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Verificar si el click no fue en el botón "VER DETALLE"
            if (!e.target.closest('.ver-detalle-btn')) {
                const prendaId = this.dataset.id;
                mostrarDetallePrenda(prendaId);
            }
        });
    });
    
    // Eventos para botones "VER DETALLE"
    const verDetalleBtns = document.querySelectorAll('.ver-detalle-btn');
    verDetalleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.prenda-card');
            const prendaId = card.dataset.id;
            mostrarDetallePrenda(prendaId);
        });
    });
    
    // Cerrar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', cerrarModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', cerrarModal);
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && detalleModal.classList.contains('active')) {
            cerrarModal();
        }
    });
    
    // Estilos adicionales para los detalles
    const style = document.createElement('style');
    style.textContent = `
        .detalles-adicionales {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .detalle-item {
            font-size: 13px;
            margin-bottom: 8px;
            color: #666;
        }
        
        .detalle-item strong {
            color: #000;
            font-weight: 500;
        }
        
        .talla-mensaje {
            font-size: 12px;
            margin-top: 10px;
            min-height: 20px;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-height: 85vh;
            }
        }
    `;
    document.head.appendChild(style);
});
