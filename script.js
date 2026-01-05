// =============================================
// THREE.JS - ANIMACIÓN DE ENTRADA
// =============================================

let scene, camera, renderer, textMeshV, textMeshG;
let currentPhase = 0;
let startTime;
let animationId;
const debugInfo = document.getElementById('debugInfo');

function initThreeJS() {
    debugInfo.textContent = "Iniciando animación 3D...";
    
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
    
    // 5. Cargar fuente
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
}

function loadFont() {
    const loader = new THREE.FontLoader();
    
    loader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        function(font) {
            debugInfo.textContent = "Creando texto 3D...";
            createText3D(font);
        },
        function(xhr) {
            debugInfo.textContent = `Cargando fuente: ${Math.round(xhr.loaded / xhr.total * 100)}%`;
        },
        function(error) {
            debugInfo.textContent = "Error cargando fuente, usando alternativa";
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
    
    debugInfo.textContent = "Texto 3D creado, iniciando animación...";
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
                
                debugInfo.textContent = `Animación: Entrada ${Math.round(t1 * 100)}%`;
                
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
                
                debugInfo.textContent = `Animación: Giro ${Math.round(elapsed / 4000 * 100)}%`;
                
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
                
                debugInfo.textContent = `Animación: Salida ${Math.round(t2 * 100)}%`;
                
                if (t2 >= 1) {
                    setTimeout(showDashboard, 1000);
                }
                break;
        }
    }
    
    renderer.render(scene, camera);
}

function showDashboard() {
    debugInfo.textContent = "Mostrando catálogo...";
    
    if (animationId) cancelAnimationFrame(animationId);
    
    if (scene && textMeshV && textMeshG) {
        scene.remove(textMeshV);
        scene.remove(textMeshG);
    }
    
    document.getElementById('phase1').classList.remove('active');
    document.getElementById('phase2').classList.add('active');
    
    // Cargar imágenes
    loadModelBackground();
    loadSetImage();
    
    // Configurar navegación
    setupNavigation();
    
    // Ocultar debug después de 3 segundos
    setTimeout(() => {
        debugInfo.style.opacity = '0';
        setTimeout(() => {
            debugInfo.style.display = 'none';
        }, 1000);
    }, 3000);
}

// =============================================
// CARGAR FONDO DEL MODELO
// =============================================

function loadModelBackground() {
    debugInfo.textContent = "Cargando fondo modelo1.png...";
    
    const modelBg = document.querySelector('.model-background');
    
    // Crear imagen
    const img = new Image();
    
    img.onload = function() {
        debugInfo.textContent = "Fondo modelo1.png cargado ✓";
        console.log('✅ Fondo modelo1.png cargado correctamente');
        modelBg.style.backgroundImage = `url('${img.src}')`;
        modelBg.style.opacity = '0.5';
    };
    
    img.onerror = function() {
        debugInfo.textContent = "Error cargando modelo1.png";
        console.error('❌ ERROR: No se pudo cargar modelo1.png');
        console.log('🔍 Verifica que:');
        console.log('1. El archivo existe y se llama EXACTAMENTE "modelo1.png"');
        console.log('2. Está en la misma carpeta que el HTML');
        console.log('3. No tiene errores de sintaxis en el nombre');
        
        // Usar fondo alternativo
        modelBg.style.background = 'linear-gradient(45deg, #0a0a0f, #1a1a2e)';
        modelBg.style.opacity = '0.7';
    };
    
    // Intentar cargar la imagen
    img.src = 'modelo1.png';
}

// =============================================
// SISTEMA DE NAVEGACIÓN
// =============================================

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover activo de todo
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Agregar activo al clickeado
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section') + 'Section';
            document.getElementById(sectionId).classList.add('active');
            
            // Si es otra sección que no sea inicio, ocultar el fondo del modelo
            const modelBg = document.querySelector('.model-background');
            if (this.getAttribute('data-section') === 'home') {
                modelBg.style.display = 'block';
            } else {
                modelBg.style.display = 'none';
            }
        });
    });
}

// CARGAR IMAGEN DEL CONJUNTO
function loadSetImage() {
    const setImageContainer = document.getElementById('set1Image');
    
    const img = document.createElement('img');
    img.src = 'conjunto1.png';
    img.alt = 'Conjunto Vestige #1';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    
    img.onload = function() {
        console.log('✅ Imagen conjunto1.png cargada correctamente');
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);
    };
    
    img.onerror = function() {
        console.warn('⚠️ No se pudo cargar conjunto1.png, usando placeholder');
        
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.display = 'flex';
        placeholder.style.flexDirection = 'column';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = 'rgba(255, 255, 255, 0.3)';
        placeholder.style.textAlign = 'center';
        
        const icon = document.createElement('div');
        icon.innerHTML = `
            <svg width="80" height="80" viewBox="0 0 24 24" style="fill: rgba(102, 126, 234, 0.3); margin-bottom: 20px;">
                <path d="M21.6 18.2L13 11.75v-.8c1.35-.49 2.25-1.62 2.25-2.95 0-1.62-1.38-2.94-3.08-2.94s-3.08 1.32-3.08 2.94c0 1.33.9 2.46 2.25 2.95v.8L2.4 18.2c-.66.55-.75 1.55-.2 2.21.55.66 1.55.75 2.21.2L12 14.25l7.6 6.36c.66.55 1.66.46 2.21-.2.55-.66.46-1.66-.2-2.21z"/>
            </svg>
        `;
        
        const text = document.createElement('div');
        text.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 10px; color: rgba(255, 255, 255, 0.5);">Conjunto #1</div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.3);">Imagen no disponible</div>
        `;
        
        placeholder.appendChild(icon);
        placeholder.appendChild(text);
        setImageContainer.appendChild(placeholder);
    };
    
    setImageContainer.appendChild(img);
}

// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Vestige Catálogo iniciando...');
    
    // Iniciar animación 3D
    initThreeJS();
    
    // Redimensionamiento
    window.addEventListener('resize', onWindowResize);
});

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
