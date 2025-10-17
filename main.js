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

// Backwards-compatible init function (noop)
function initThree() {
    // La scène Three.js est déjà initialisée au top-level de ce fichier.
    // Cette fonction préserve la compatibilité pour d'éventuels appels externes.
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================
// Navigation & Scroll Effects
// ==========================================

// Active navigation on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === current) {
            item.classList.add('active');
        }
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade-in animation on scroll
function revealOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// ==========================================
// Event Listeners
// ==========================================

window.addEventListener('scroll', () => {
    updateActiveNav();
    revealOnScroll();
});

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initThree();
    revealOnScroll();
    updateActiveNav();

    // Typing effect (looping through phrases)
    const typingEl = document.querySelector('.typing-text');
    const cursorEl = document.querySelector('.typing-cursor');
    if (typingEl) {
        const raw = typingEl.getAttribute('data-phrases') || '';
        const phrases = raw.split(',').map(s => s.trim()).filter(Boolean);
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const typeSpeed = 80; // ms per char
        const deleteSpeed = 40; // ms per char when deleting
        const pauseAfter = 1200; // ms pause after full phrase

        function tick() {
            const current = phrases[phraseIndex] || typingEl.textContent || '';

            if (!deleting) {
                typingEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    // end of word
                    deleting = true;
                    setTimeout(tick, pauseAfter);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                typingEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(tick, 400);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        // start after a short delay
        setTimeout(() => {
            // Ensure cursor is visible
            if (cursorEl) cursorEl.style.opacity = '1';
            tick();
        }, 400);
    }
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

    // Close on resize (e.g., rotate iPhone)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('open');
            navLinks.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navToggle.classList.remove('open');
            navLinks.classList.remove('mobile-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // fermer en cliquant / tapant à l'extérieur
    function closeMobileNav() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // click outside
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('mobile-open')) return;
        const target = e.target;
        if (!navLinks.contains(target) && !navToggle.contains(target)) {
            closeMobileNav();
        }
    });

    // touchstart pour meilleure réactivité sur mobile
    document.addEventListener('touchstart', (e) => {
        if (!navLinks.classList.contains('mobile-open')) return;
        const target = e.target;
        if (!navLinks.contains(target) && !navToggle.contains(target)) {
            closeMobileNav();
        }
    });
}

// ==========================================
// Additional Interactions
// ==========================================

// Project cards hover effect
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==========================================
// TimeLine
// ==========================================

// Controller ScrollMagic (if available)
let controller = null;
if (typeof ScrollMagic !== 'undefined') {
    controller = new ScrollMagic.Controller();
}

// Prépare le tracé du trait — recherche d'abord un <line> dans un <svg>
let line = document.querySelector('svg #timeline') || document.querySelector('line#timeline') || document.querySelector('#timeline');
let length = 0;

if (line) {
    // Si l'élément expose getTotalLength, on l'utilise
    if (typeof line.getTotalLength === 'function') {
        length = line.getTotalLength();
    } else if (line.tagName && line.tagName.toLowerCase() === 'line') {
        // fallback: calculer la longueur à partir des attributs x1,y1,x2,y2
        const x1 = parseFloat(line.getAttribute('x1')) || 0;
        const y1 = parseFloat(line.getAttribute('y1')) || 0;
        const x2 = parseFloat(line.getAttribute('x2')) || 0;
        const y2 = parseFloat(line.getAttribute('y2')) || 0;
        length = Math.hypot(x2 - x1, y2 - y1);
    } else {
        // autre élément non-SVG ou méthode manquante — choisir une valeur par défaut
        length = 2000;
    }

    // Si GSAP est présent, on l'utilise; sinon on applique un style direct
    if (typeof gsap !== 'undefined') {
        try {
            gsap.set(line, {
                strokeDasharray: length,
                strokeDashoffset: length,
                visibility: 'visible'
            });
        } catch (e) {
            // ignore
            line.style.visibility = 'visible';
        }
    } else {
        // fallback CSS setup
        try {
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
            line.style.visibility = 'visible';
        } catch (e) {
            // nothing
        }
    }
}

// Fonction d’animation (utilise GSAP/ScrollMagic si disponibles, sinon noop)
function animateTimeline(trigger, fromPercent, toPercent) {
    if (!line) return;

    if (typeof gsap !== 'undefined' && typeof ScrollMagic !== 'undefined' && controller) {
        const tween = gsap.fromTo(
            line,
            { strokeDashoffset: length * (1 - fromPercent / 100) },
            { strokeDashoffset: length * (1 - toPercent / 100), duration: 1 }
        );

        new ScrollMagic.Scene({
            triggerElement: trigger,
            triggerHook: 0.8
        })
        .setTween(tween)
        .addTo(controller);
    } else {
        // fallback minimal: when trigger enters viewport, set dashoffset instantly
        const el = document.querySelector(trigger);
        if (!el) return;
        const onScroll = () => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                const targetOffset = length * (1 - toPercent / 100);
                if (line.style) {
                    line.style.transition = 'stroke-dashoffset 0.6s linear';
                    line.style.strokeDashoffset = targetOffset;
                }
                window.removeEventListener('scroll', onScroll);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        // check now in case already visible
        onScroll();
    }
}

// Scènes (ou fallback listeners)
animateTimeline('#timeline', 0, 10);
animateTimeline('.dayTwo', 10, 20);
animateTimeline('.dayThree', 20, 40);
animateTimeline('.dayFour', 40, 65);
animateTimeline('.dayFive', 65, 85);
animateTimeline('.daySix', 85, 100);
