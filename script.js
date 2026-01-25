// FUNCIONALIDAD FLUIDA Y LIMPIA
document.addEventListener('DOMContentLoaded', () => {
    
    // ===== ELEMENTOS =====
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const cartBtn = document.getElementById('cartBtn');
    const cartCount = document.querySelector('.cart-count');
    
    // ===== VARIABLES =====
    let cartItems = 0;
    let isMenuOpen = false;
    
    // ===== FUNCIONES =====
    
    // Abrir menú
    function openMenu() {
        if (isMenuOpen) return;
        
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
        
        // Efecto en las líneas del hamburguesa
        const lines = document.querySelectorAll('.line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transform = `rotate(${index === 0 ? '45deg' : index === 1 ? '-45deg' : '0deg'})`;
                line.style.width = '22px';
            }, index * 50);
        });
    }
    
    // Cerrar menú
    function closeMenu() {
        if (!isMenuOpen) return;
        
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
        
        // Reset líneas
        const lines = document.querySelectorAll('.line');
        lines.forEach((line, index) => {
            line.style.transform = 'rotate(0deg)';
            if (index === 2) {
                line.style.width = '16px';
            }
        });
    }
    
    // Carrito
    function updateCart() {
        cartItems++;
        if (cartCount) {
            cartCount.textContent = cartItems;
            
            // Efecto visual
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // ===== EVENT LISTENERS =====
    
    // Hamburguesa
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMenu);
    }
    
    // Cerrar menú
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    // Overlay para cerrar
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Carrito
    if (cartBtn && cartCount) {
        cartBtn.addEventListener('click', updateCart);
    }
    
    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // ===== EFECTOS FLUIDOS =====
    
    // Links del menú
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Cerrar menú después de click
            setTimeout(closeMenu, 300);
        });
    });
    
    // Efecto hover smooth para botón SHOP NOW
    const shopNowBtn = document.querySelector('.shop-now-text');
    if (shopNowBtn) {
        shopNowBtn.style.opacity = '0';
        shopNowBtn.style.transform = 'translate(-50%, -40%)';
        
        setTimeout(() => {
            shopNowBtn.style.transition = 'opacity 0.8s ease, transform 0.8s ease, letter-spacing 0.3s ease';
            shopNowBtn.style.opacity = '1';
            shopNowBtn.style.transform = 'translate(-50%, -50%)';
        }, 300);
    }
    
    // Prevenir comportamiento por defecto en enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    console.log('Denim Tears - Navegación fluida cargada');
});
