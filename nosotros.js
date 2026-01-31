// GALERÍA INTERACTIVA
class GaleriaModelos {
    constructor() {
        this.currentIndex = 0;
        this.modelos = document.querySelectorAll('.modelo-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.init();
    }
    
    init() {
        // Inicializar eventos
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Eventos para dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
        
        // Inicializar primera vista
        this.updateView();
        
        // Auto-rotación (opcional)
        this.startAutoRotation();
    }
    
    prev() {
        this.currentIndex = this.currentIndex === 0 ? this.modelos.length - 1 : this.currentIndex - 1;
        this.updateView();
        this.resetAutoRotation();
    }
    
    next() {
        this.currentIndex = this.currentIndex === this.modelos.length - 1 ? 0 : this.currentIndex + 1;
        this.updateView();
        this.resetAutoRotation();
    }
    
    goTo(index) {
        this.currentIndex = index;
        this.updateView();
        this.resetAutoRotation();
    }
    
    updateView() {
        // Actualizar modelo activo
        this.modelos.forEach((modelo, index) => {
            modelo.style.opacity = index === this.currentIndex ? '1' : '0.5';
            modelo.style.transform = index === this.currentIndex ? 'scale(1.02)' : 'scale(0.98)';
            modelo.style.transition = 'all 0.3s ease';
        });
        
        // Actualizar dots
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.classList.remove('active');
                dot.style.transform = 'scale(1)';
            }
        });
    }
    
    startAutoRotation() {
        this.autoRotation = setInterval(() => {
            this.next();
        }, 5000); // Cambia cada 5 segundos
    }
    
    resetAutoRotation() {
        clearInterval(this.autoRotation);
        this.startAutoRotation();
    }
}

// ANIMACIONES DE SCROLL
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    
    init() {
        // Observador de intersección para animaciones
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observar todas las secciones
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// EFECTO PARALLAX EN HERO
function initParallax() {
    const hero = document.querySelector('.nosotros-hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translate3d(0px, ${rate}px, 0px)`;
    });
}

// INTERACTIVIDAD DE REDES SOCIALES
function initRedesSociales() {
    const redesBtns = document.querySelectorAll('.redes-btn');
    
    redesBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
        
        // Simular conteo de seguidores (efecto visual)
        const followers = this.querySelector('.redes-followers');
        if (followers && !followers.dataset.animated) {
            followers.dataset.animated = 'true';
            this.addEventListener('mouseenter', () => {
                followers.style.opacity = '1';
                followers.style.transform = 'translateY(0)';
            });
        }
    });
}

// CONTADOR ANIMADO (opcional - para estadísticas)
class ContadorAnimado {
    constructor(elementos) {
        this.elementos = elementos;
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animarContadores();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.elementos.forEach(el => observer.observe(el));
    }
    
    animarContadores() {
        this.elementos.forEach(elemento => {
            const final = parseInt(elemento.textContent);
            const incremento = final / 50;
            let contador = 0;
            
            const timer = setInterval(() => {
                contador += incremento;
                if (contador >= final) {
                    elemento.textContent = final;
                    clearInterval(timer);
                } else {
                    elemento.textContent = Math.floor(contador);
                }
            }, 20);
        });
    }
}

// INICIALIZACIÓN GENERAL
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página Nosotros cargada');
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Inicializar galería
    const galeria = new GaleriaModelos();
    
    // Inicializar animaciones de scroll
    const animaciones = new ScrollAnimations();
    
    // Inicializar parallax
    initParallax();
    
    // Inicializar redes sociales
    initRedesSociales();
    
    // Inicializar contadores animados (si existen)
    const contadores = document.querySelectorAll('.contador');
    if (contadores.length > 0) {
        new ContadorAnimado(contadores);
    }
    
    // Efecto hover en tarjetas
    const cards = document.querySelectorAll('.modelo-card, .reseña-card, .contacto-item, .mision, .vision');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Agregar estilos CSS dinámicos
    const dynamicStyles = `
        .animated {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        section {
            opacity: 0;
        }
        
        section.animated {
            opacity: 1;
        }
        
        .redes-followers {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        
        .redes-btn:hover .redes-followers {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
    
    // Función para actualizar contador del carrito (compartida)
    function actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            cartCount.textContent = carrito.length;
        }
    }
    
    // Efecto de carga progresiva para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.modelo-img').forEach(img => {
            img.style.opacity = '0';
            img.style.transform = 'scale(1.05)';
            img.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            imageObserver.observe(img);
        });
    }
    
    // Navegación suave entre secciones
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
