// =============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// =============================================

// Credenciales válidas (sin mostrar en frontend)
const VALID_USERS = {
    'fabricio': 'fabriciolobo1',
    'chocolatito': 'xgustavoelcrackx'
};

// Elementos del DOM
let scene, camera, renderer, textMeshV, textMeshG;
let currentPhase = 0;
let startTime;
let animationId;
let currentUser = null;

// =============================================
// THREE.JS - ANIMACIÓN DE ENTRADA (FASE 1)
// =============================================

function initThreeJS() {
    console.log("Iniciando Three.js...");
    
    // 1. Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // 2. Cámara
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 40;
    
    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('container3d').appendChild(renderer.domElement);
    
    // 4. Luces
    setupLights();
    
    // 5. Cargar fuente y crear texto
    loadFont();
    
    // 6. Iniciar animación
    startAnimation();
}

function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-10, -10, -5);
    scene.add(fillLight);
}

function loadFont() {
    const loader = new THREE.FontLoader();
    
    loader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        function(font) {
            createText3D(font);
        },
        function(xhr) {
            console.log('Cargando fuente: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        function(error) {
            console.error('Error cargando fuente:', error);
            createFallbackText();
        }
    );
}

function createText3D(font) {
    const textSettings = {
        font: font,
        size: 8,
        height: 3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 5
    };
    
    // Crear "V"
    const geometryV = new THREE.TextGeometry('V', textSettings);
    geometryV.center();
    
    const materialV = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        specular: 0x222222
    });
    
    textMeshV = new THREE.Mesh(geometryV, materialV);
    textMeshV.position.x = -10;
    textMeshV.position.y = -20;
    
    // Crear "G"
    const geometryG = new THREE.TextGeometry('G', textSettings);
    geometryG.center();
    
    const materialG = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 100,
        specular: 0x222222
    });
    
    textMeshG = new THREE.Mesh(geometryG, materialG);
    textMeshG.position.x = 10;
    textMeshG.position.y = 20;
    
    scene.add(textMeshV);
    scene.add(textMeshG);
}

function createFallbackText() {
    const canvasV = document.createElement('canvas');
    const ctxV = canvasV.getContext('2d');
    canvasV.width = 256;
    canvasV.height = 256;
    
    ctxV.fillStyle = '#000000';
    ctxV.fillRect(0, 0, canvasV.width, canvasV.height);
    ctxV.fillStyle = '#ffffff';
    ctxV.font = '200px Arial';
    ctxV.textAlign = 'center';
    ctxV.textBaseline = 'middle';
    ctxV.fillText('V', canvasV.width/2, canvasV.height/2);
    
    const textureV = new THREE.CanvasTexture(canvasV);
    const materialV = new THREE.MeshBasicMaterial({ map: textureV, transparent: true });
    const geometryV = new THREE.PlaneGeometry(10, 10);
    textMeshV = new THREE.Mesh(geometryV, materialV);
    textMeshV.position.x = -10;
    textMeshV.position.y = -20;
    
    const canvasG = document.createElement('canvas');
    const ctxG = canvasG.getContext('2d');
    canvasG.width = 256;
    canvasG.height = 256;
    
    ctxG.fillStyle = '#000000';
    ctxG.fillRect(0, 0, canvasG.width, canvasG.height);
    ctxG.fillStyle = '#ffffff';
    ctxG.font = '200px Arial';
    ctxG.textAlign = 'center';
    ctxG.textBaseline = 'middle';
    ctxG.fillText('G', canvasG.width/2, canvasG.height/2);
    
    const textureG = new THREE.CanvasTexture(canvasG);
    const materialG = new THREE.MeshBasicMaterial({ map: textureG, transparent: true });
    const geometryG = new THREE.PlaneGeometry(10, 10);
    textMeshG = new THREE.Mesh(geometryG, materialG);
    textMeshG.position.x = 10;
    textMeshG.position.y = 20;
    
    scene.add(textMeshV);
    scene.add(textMeshG);
}

function startAnimation() {
    startTime = Date.now();
    currentPhase = 0;
    animate();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    const currentTime = Date.now() - startTime;
    
    if (textMeshV && textMeshG) {
        switch(currentPhase) {
            case 0: // ENTRADA (0-2 segundos)
                const t1 = Math.min(currentTime / 2000, 1);
                
                textMeshV.position.x = THREE.MathUtils.lerp(-10, -4, t1);
                textMeshV.position.y = THREE.MathUtils.lerp(-20, 0, t1);
                textMeshV.rotation.y = t1 * Math.PI * 2;
                
                textMeshG.position.x = THREE.MathUtils.lerp(10, 4, t1);
                textMeshG.position.y = THREE.MathUtils.lerp(20, 0, t1);
                textMeshG.rotation.y = -t1 * Math.PI * 2;
                
                if (t1 >= 1) {
                    currentPhase = 1;
                    startTime = Date.now();
                }
                break;
                
            case 1: // GIRO EN EL CENTRO (2-6 segundos)
                const elapsed = currentTime;
                
                textMeshV.rotation.y += 0.01;
                textMeshG.rotation.y -= 0.01;
                
                textMeshV.position.y = Math.sin(Date.now() * 0.001) * 0.3;
                textMeshG.position.y = Math.cos(Date.now() * 0.001) * 0.3;
                
                camera.position.x = Math.sin(Date.now() * 0.0005) * 20;
                camera.position.z = 40 + Math.cos(Date.now() * 0.0005) * 5;
                camera.lookAt(0, 0, 0);
                
                if (elapsed >= 4000) {
                    currentPhase = 2;
                    startTime = Date.now();
                }
                break;
                
            case 2: // SALIDA/DESVANECIMIENTO (6-8 segundos)
                const t2 = Math.min(currentTime / 2000, 1);
                
                textMeshV.position.x = THREE.MathUtils.lerp(-4, -10, t2);
                textMeshV.position.y = THREE.MathUtils.lerp(0, -20, t2);
                textMeshV.material.opacity = 1 - t2;
                textMeshV.material.transparent = true;
                
                textMeshG.position.x = THREE.MathUtils.lerp(4, 10, t2);
                textMeshG.position.y = THREE.MathUtils.lerp(0, 20, t2);
                textMeshG.material.opacity = 1 - t2;
                textMeshG.material.transparent = true;
                
                if (t2 >= 1) {
                    setTimeout(showLoginPhase, 1000);
                }
                break;
        }
    }
    
    renderer.render(scene, camera);
}

function showLoginPhase() {
    if (animationId) cancelAnimationFrame(animationId);
    
    if (scene && textMeshV && textMeshG) {
        scene.remove(textMeshV);
        scene.remove(textMeshG);
    }
    
    document.getElementById('phase1').classList.remove('active');
    document.getElementById('phase2').classList.add('active');
}

// =============================================
// SISTEMA DE LOGIN (FASE 2)
// =============================================

function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = loginForm.querySelector('.login-btn');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    const btnText = loginBtn.querySelector('.btn-text');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Mostrar loading
        btnText.style.opacity = '0.5';
        btnLoader.style.opacity = '1';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            if (VALID_USERS[username] && VALID_USERS[username] === password) {
                currentUser = username;
                loginSuccess(username);
            } else {
                showError('Acceso denegado. Verifica tus credenciales.');
            }
            
            btnText.style.opacity = '1';
            btnLoader.style.opacity = '0';
            loginBtn.disabled = false;
        }, 1000);
    });
    
    ['username', 'password'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            errorMessage.style.display = 'none';
        });
    });
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    errorMessage.style.animation = 'none';
    void errorMessage.offsetWidth;
    errorMessage.style.animation = 'shake 0.5s';
}

function loginSuccess(username) {
    document.getElementById('phase2').classList.remove('active');
    document.getElementById('phase3').classList.add('active');
    
    setupDashboard(username);
    loadClothesImage(); // Cargar imagen de la prenda
}

// =============================================
// DASHBOARD Y SECCIÓN DE PRENDAS (FASE 3)
// =============================================

function setupDashboard(username) {
    document.getElementById('userWelcome').textContent = `Bienvenido, ${username}`;
    document.getElementById('profileUsername').textContent = username;
    document.getElementById('avatarInitials').textContent = username.charAt(0).toUpperCase();
    
    updateLastAccess();
    setupMenu();
    setupControls();
}

function updateLastAccess() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('es-ES', options);
    
    document.getElementById('lastAccess').textContent = formattedDate;
    document.getElementById('profileLastAccess').textContent = formattedDate;
}

function setupMenu() {
    const menuItems = document.querySelectorAll('.menu-item:not(.logout)');
    const sections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section') + 'Section';
            document.getElementById(sectionId).classList.add('active');
            
            // Si es la sección de prendas, actualizar efectos
            if (sectionId === 'clothesSection') {
                updateClothesEffects();
            }
        });
    });
}

// CARGAR IMAGEN DE LA PRENDA
function loadClothesImage() {
    const clothesImageContainer = document.getElementById('clothesImage');
    
    // Crear elemento de imagen
    const img = document.createElement('img');
    img.src = 'conjunto1.png'; // Nombre del archivo de imagen
    img.alt = 'Conjunto Vestige #1';
    img.onload = function() {
        console.log('Imagen de prenda cargada correctamente');
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    };
    
    img.onerror = function() {
        console.warn('No se pudo cargar conjunto1.png, usando placeholder');
        
        // Crear placeholder artístico
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.display = 'flex';
        placeholder.style.flexDirection = 'column';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = 'rgba(255, 255, 255, 0.3)';
        placeholder.style.textAlign = 'center';
        placeholder.style.padding = '20px';
        
        const icon = document.createElement('div');
        icon.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" style="fill: rgba(102, 126, 234, 0.3); margin-bottom: 20px;">
                <path d="M21.6 18.2L13 11.75v-.8c1.35-.49 2.25-1.62 2.25-2.95 0-1.62-1.38-2.94-3.08-2.94s-3.08 1.32-3.08 2.94c0 1.33.9 2.46 2.25 2.95v.8L2.4 18.2c-.66.55-.75 1.55-.2 2.21.55.66 1.55.75 2.21.2L12 14.25l7.6 6.36c.66.55 1.66.46 2.21-.2.55-.66.46-1.66-.2-2.21z"/>
            </svg>
        `;
        
        const text = document.createElement('div');
        text.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 10px; color: rgba(255, 255, 255, 0.5);">Conjunto #1</div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.3);">Vestige Collection</div>
        `;
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text);
        clothesImageContainer.appendChild(placeholder);
    };
    
    clothesImageContainer.appendChild(img);
}

// ACTUALIZAR EFECTOS DE LA SECCIÓN PRENDAS
function updateClothesEffects() {
    const effects = document.querySelectorAll('.effect');
    effects.forEach((effect, index) => {
        effect.style.animation = 'none';
        void effect.offsetWidth;
        effect.style.animation = `effectFloat 8s ease-in-out infinite ${index * 2}s`;
    });
    
    const card = document.querySelector('.clothes-card-3d');
    if (card) {
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'cardFloat 6s ease-in-out infinite';
    }
}

function setupControls() {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            logout();
        }
    });
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const animationsToggle = document.getElementById('animationsToggle');
    
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });
    
    notificationsToggle.addEventListener('change', function() {
        localStorage.setItem('notifications', this.checked);
    });
    
    animationsToggle.addEventListener('change', function() {
        localStorage.setItem('animations', this.checked);
    });
    
    loadPreferences();
}

function loadPreferences() {
    const darkMode = localStorage.getItem('darkMode') !== 'false';
    const notifications = localStorage.getItem('notifications') !== 'false';
    const animations = localStorage.getItem('animations') !== 'false';
    
    document.getElementById('darkModeToggle').checked = darkMode;
    document.getElementById('notificationsToggle').checked = notifications;
    document.getElementById('animationsToggle').checked = animations;
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function logout() {
    document.getElementById('phase3').classList.remove('active');
    document.getElementById('loginForm').reset();
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('phase2').classList.add('active');
    currentUser = null;
}

// =============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema Vestige iniciando...');
    
    initThreeJS();
    setupLogin();
    
    window.addEventListener('resize', onWindowResize);
});

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// CSS adicional
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .dark-mode {
        --bg-color: #0a0a0f;
        --card-bg: rgba(255, 255, 255, 0.03);
    }
    
    /* Estilos para la imagen de prenda */
    #clothesImage img {
        max-width: 100%;
        height: auto;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);
