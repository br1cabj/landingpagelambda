const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Rastrear posición del mouse
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Ajustar el canvas si se redimensiona la ventana
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Clase constructora para los Nodos
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    // Método para dibujar el nodo individual
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Método para calcular la nueva posición y dibujar
    update() {
        // Efecto rebote en los bordes
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

// Inicializar el array de partículas
function init() {
    particlesArray = [];
    // Controlamos la densidad de nodos según el tamaño de pantalla
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    const colors = ['#FFD700', '#8A2BE2', '#4CAF50']; // Oro, Violeta, Verde
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Lógica de conexión entre nodos y el mouse
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // Conexión entre nodos cercanos
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.05)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
        
        // Conexión interactiva con el mouse
        let dx = mouse.x - particlesArray[a].x;
        let dy = mouse.y - particlesArray[a].y;
        let distanceMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceMouse < mouse.radius) {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)'; // Línea dorada más visible
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Bucle principal de renderizado
let isCanvasVisible = true;
let animationFrameId;

function animate() {
    if (!isCanvasVisible) return; // Pausa el bucle si no es visible
    
    ctx.clearRect(0, 0, innerWidth, innerHeight); // Limpiar el lienzo
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
    animationFrameId = requestAnimationFrame(animate);
}

// Arrancar el motor
init();
animate();

// Optimización: Pausar el canvas cuando el Hero no es visible
const heroSection = document.getElementById('inicio');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isCanvasVisible) {
                    isCanvasVisible = true;
                    animate(); // Reanudar animación
                }
            } else {
                isCanvasVisible = false; // Pausar animación
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0 }); // 0 = cuando salga completamente de la pantalla
    observer.observe(heroSection);
}