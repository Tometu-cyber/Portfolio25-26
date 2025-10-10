const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('canvas3d'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x64ffda,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Geometric grid
const gridSize = 50;
const gridDivisions = 50;
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x64ffda, 0x172a45);
gridHelper.rotation.x = Math.PI / 2;
gridHelper.position.z = -20;
gridHelper.material.opacity = 0.15;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Wireframe shapes
const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const wireframeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x64ffda,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const torus = new THREE.Mesh(torusGeometry, wireframeMaterial);
torus.position.set(15, 5, -10);
scene.add(torus);

const boxGeometry = new THREE.BoxGeometry(6, 6, 6);
const box = new THREE.Mesh(boxGeometry, wireframeMaterial);
box.position.set(-15, -5, -15);
scene.add(box);

camera.position.z = 30;

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    
    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    
    box.rotation.x += 0.004;
    box.rotation.y += 0.004;
    
    particlesMesh.rotation.y += 0.0005;
    
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// ==========================================
// Navigation
// ==========================================

// Active navigation on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Trigger update on scroll
window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('open');
        navLinks.classList.toggle('mobile-open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Init on load
document.addEventListener('DOMContentLoaded', updateActiveNav);

// Init typing effect for .typing-text
function initTyping() {
    const el = document.querySelector('.typing-text');
    if (!el) return;

    const phrases = (el.dataset.phrases || '')
        .split(',')
        .map(p => p.trim())
        .filter(Boolean);

    if (phrases.length === 0) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const current = phrases[phraseIndex];
        if (!deleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(tick, 1400); // pause on full phrase
                return;
            }
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }
        setTimeout(tick, deleting ? 50 : 100);
    }

    tick();
}

// Init on load: keep l'appel à updateActiveNav et ajoute initTyping
document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    initTyping();
});
