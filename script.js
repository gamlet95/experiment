// ===========================
// SCROLL ANIMATION ENGINE
// ===========================

// Get all animated elements
const floatingElement = document.getElementById('floatingElement');
const textLayers = document.querySelectorAll('.text-layer');
const glassPanels = document.querySelectorAll('.glass-panel');
const bgLayers = document.querySelectorAll('.bg-layer');

// Track scroll position
let scrollPosition = 0;
let ticking = false;

// ===========================
// UPDATE ANIMATIONS
// ===========================
function updateAnimations() {
    // Get scroll percentage of total page
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollPosition / scrollHeight;

    // Animate floating element
    animateFloatingElement(scrollPercent);

    // Animate background layers (parallax)
    animateBackgroundLayers(scrollPercent);

    // Check visibility of text and panels
    checkElementsVisibility();

    ticking = false;
}

// ===========================
// FLOATING ELEMENT ANIMATION (3D CUBE)
// ===========================
function animateFloatingElement(scrollPercent) {
    // Move across screen horizontally
    const moveX = scrollPercent * window.innerWidth * 0.6;
    
    // Move vertically with sine wave
    const moveY = Math.sin(scrollPercent * Math.PI * 2) * 100;
    
    // Scale changes
    const scale = 1 + scrollPercent * 0.3;
    
    // Apply transforms to container
    floatingElement.style.transform = `
        translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))
        scale(${scale})
    `;
    
    // ROTACIÓN 3D del cubo basada en scroll
    const cube = floatingElement.querySelector('.cube-3d');
    if (cube) {
        const rotateY = scrollPercent * 720; // 2 vueltas completas
        const rotateX = scrollPercent * 360; // 1 vuelta completa
        cube.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
    
    // Opacity fade in/out
    const opacity = 1 - Math.abs(scrollPercent - 0.5) * 1.2;
    floatingElement.style.opacity = Math.max(0.4, Math.min(1, opacity));
}

// ===========================
// BACKGROUND PARALLAX
// ===========================
function animateBackgroundLayers(scrollPercent) {
    bgLayers.forEach((layer, index) => {
        // Different speeds for each layer
        const speed = (index + 1) * 0.3;
        const yPos = scrollPosition * speed;
        
        layer.style.transform = `translateY(${yPos}px)`;
    });
}

// ===========================
// VISIBILITY DETECTION
// ===========================
function checkElementsVisibility() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.75;

    // Check text layers
    textLayers.forEach(layer => {
        const rect = layer.getBoundingClientRect();
        if (rect.top < triggerPoint && rect.bottom > 0) {
            layer.classList.add('visible');
        }
    });

    // Check glass panels
    glassPanels.forEach(panel => {
        const rect = panel.getBoundingClientRect();
        if (rect.top < triggerPoint && rect.bottom > 0) {
            panel.classList.add('visible');
        }
    });
}

// ===========================
// SCROLL EVENT HANDLER
// ===========================
function onScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (!ticking) {
        window.requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

// ===========================
// SMOOTH SCROLL TO SECTION
// ===========================
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ===========================
// MOUSE PARALLAX EFFECT
// ===========================
let mouseX = 0;
let mouseY = 0;
let currentRotateY = 0;
let currentRotateX = 0;

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function updateMouseParallax() {
    const cube = floatingElement.querySelector('.cube-3d');
    if (cube) {
        // Get current rotation from scroll
        const transform = cube.style.transform;
        const rotateYMatch = transform.match(/rotateY\(([-\d.]+)deg\)/);
        const rotateXMatch = transform.match(/rotateX\(([-\d.]+)deg\)/);
        
        const baseRotateY = rotateYMatch ? parseFloat(rotateYMatch[1]) : 0;
        const baseRotateX = rotateXMatch ? parseFloat(rotateXMatch[1]) : 0;
        
        // Add subtle mouse parallax to current rotation
        const mouseInfluenceY = mouseX * 5;
        const mouseInfluenceX = mouseY * 5;
        
        // Smooth interpolation
        currentRotateY += (baseRotateY + mouseInfluenceY - currentRotateY) * 0.1;
        currentRotateX += (baseRotateX - mouseInfluenceX - currentRotateX) * 0.1;
        
        cube.style.transform = `rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg)`;
    }

    requestAnimationFrame(updateMouseParallax);
}

// ===========================
// INITIALIZE
// ===========================
function init() {
    // Initial visibility check
    checkElementsVisibility();
    
    // Initial animation update
    updateAnimations();
    
    // Start mouse parallax loop
    requestAnimationFrame(updateMouseParallax);
}

// ===========================
// EVENT LISTENERS
// ===========================
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('mousemove', onMouseMove, { passive: true });
window.addEventListener('load', init);

// Run init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
