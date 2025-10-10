// ==========================================
// Navigation
// ==========================================

window.addEventListener('scroll', () => {
    updateActiveNav();
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