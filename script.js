// Elementos
const inicio = document.getElementById('inicio');
const dropPrendas = document.getElementById('drop-prendas');
const dropDetalle = document.getElementById('drop-detalle');
const linkInicio = document.getElementById('linkInicio');
const linkDrop = document.getElementById('linkDrop');
const volverInicioDesdePrendas = document.getElementById('volverInicioDesdePrendas');
const volverPrendas = document.getElementById('volverPrendas');
const prendaItems = document.querySelectorAll('.prenda-item');

// Datos de las hoodies
const hoodiesData = {
    'hoodie1': {
        titulo: 'Hoodie Black Edition',
        nombre: 'Hoodie Black Premium',
        descripcion: 'Hoodie negro premium con capucha ajustable, detalles en cuero sintético y estampado único en la espalda. Material: 80% algodón, 20% poliéster. Edición limitada a 100 unidades.',
        imagen: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'hoodie2': {
        titulo: 'Hoodie Gray Premium',
        nombre: 'Hoodie Gray Urban',
        descripcion: 'Hoodie gris con diseño urbano, bolsillo canguro y detalles en contraste. Corte oversize perfecto para streetwear. Solo 75 unidades.',
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'hoodie3': {
        titulo: 'Hoodie Red Signature',
        nombre: 'Hoodie Red Limited',
        descripcion: 'Hoodie rojo con capucha bordada, cierre frontal premium y diseño minimalista. Exclusivo para coleccionistas. Solo 50 unidades.',
        imagen: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'hoodie4': {
        titulo: 'Hoodie White Exclusive',
        nombre: 'Hoodie White Premium',
        descripcion: 'Hoodie blanco con detalles en negro, corte moderno y materiales de alta calidad. Diseño exclusivo Vestige. Limitado a 25 unidades.',
        imagen: 'https://images.unsplash.com/photo-1578763460786-2301c013b0c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
};

// Inicializar: Solo Inicio visible
inicio.classList.remove('hidden');
dropPrendas.classList.remove('visible');
dropDetalle.classList.remove('visible');

// Función para mostrar Inicio
function showInicio() {
    inicio.classList.remove('hidden');
    dropPrendas.classList.remove('visible');
    dropDetalle.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para mostrar Drop (solo hoodies flotando)
function showDropPrendas() {
    inicio.classList.add('hidden');
    dropPrendas.classList.add('visible');
    dropDetalle.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para mostrar detalle de hoodie
function showDropDetalle(hoodieId) {
    const hoodie = hoodiesData[hoodieId];
    if (hoodie) {
        document.getElementById('detalle-titulo').textContent = hoodie.titulo;
        document.getElementById('detalle-nombre').textContent = hoodie.nombre;
        document.getElementById('detalle-descripcion').textContent = hoodie.descripcion;
        document.getElementById('detalle-imagen').src = hoodie.imagen;
        
        inicio.classList.add('hidden');
        dropPrendas.classList.remove('visible');
        dropDetalle.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Eventos de navegación
linkInicio.addEventListener('click', function(e) {
    e.preventDefault();
    showInicio();
});

linkDrop.addEventListener('click', function(e) {
    e.preventDefault();
    showDropPrendas();
});

// Eventos para hoodies
prendaItems.forEach(item => {
    item.addEventListener('click', function() {
        const hoodieId = this.getAttribute('data-prenda');
        showDropDetalle(hoodieId);
    });
});

// Eventos para botones volver
volverInicioDesdePrendas.addEventListener('click', showInicio);
volverPrendas.addEventListener('click', showDropPrendas);

// Contador de tiempo
let tiempoRestante = 7 * 24 * 60 * 60 * 1000;
const contadorEl = document.getElementById('tiempo');

function actualizarContador() {
    tiempoRestante -= 1000;
    const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias > 0) {
        contadorEl.textContent = dias + ' días ' + horas + ' horas';
    } else {
        contadorEl.textContent = '¡Disponible ahora!';
        clearInterval(contadorInterval);
    }
}

const contadorInterval = setInterval(actualizarContador, 1000);
actualizarContador();

// Manejo del formulario
document.getElementById('formReserva').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const talla = document.getElementById('talla').value;
    
    if (!nombre || !email || !talla) {
        alert('Por favor completa todos los campos.');
        return;
    }
    
    const reserva = {
        nombre: nombre,
        email: email,
        talla: talla,
        fecha: new Date().toISOString(),
        hoodie: document.getElementById('detalle-nombre').textContent
    };
    
    localStorage.setItem('vestige_reserva', JSON.stringify(reserva));
    
    alert('✅ ¡Reserva confirmada, ' + nombre + '!\n\nHoodie: ' + reserva.hoodie + '\nTalla: ' + talla + '\n\nRecibirás acceso VIP 24h antes del lanzamiento.');
    
    this.reset();
    
    setTimeout(() => {
        showDropPrendas();
    }, 2000);
});

// Scroll suave sin parallax
let isScrolling;
window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    
    isScrolling = setTimeout(function() {
        // Efecto sutil en las hoodies al hacer scroll
        const scrolled = window.pageYOffset;
        const prendas = document.querySelectorAll('.prenda-item img');
        prendas.forEach((img, index) => {
            const scrollEffect = Math.sin(scrolled * 0.001 + index) * 5;
            img.style.transform = 'translateY(' + scrollEffect + 'px) scale(1.05)';
            
            setTimeout(() => {
                img.style.transform = '';
            }, 300);
        });
    }, 66);
}, false);

// Prevenir comportamientos por defecto en enlaces
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
            e.preventDefault();
        }
    });
});

// Cerrar con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (dropDetalle.classList.contains('visible')) {
            showDropPrendas();
        } else if (dropPrendas.classList.contains('visible')) {
            showInicio();
        }
    }
});

// Smooth scroll para toda la página
document.addEventListener('wheel', function(e) {
    e.preventDefault();
    window.scrollBy({
        top: e.deltaY * 0.5, // Reducir velocidad para más fluidez
        behavior: 'smooth'
    });
}, { passive: false });
