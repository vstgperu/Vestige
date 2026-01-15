// Menú móvil (preparado)
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        body.classList.toggle('mobile-open');
    });
}

// Click producto (placeholder)
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        alert('Producto – detalle próximamente');
    });
});
