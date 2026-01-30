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
// FLOATING ELEMENT ANIMATION
// ===========================
function animateFloatingElement(scrollPercent) {
    // Move across screen horizontally
    const moveX = scrollPercent * window.innerWidth * 0.8;
    
    // Move vertically with sine wave
    const moveY = Math.sin(scrollPercent * Math.PI * 2) * 150;
    
    // Scale changes
    const scale = 1 + scrollPercent * 0.5;
    
    // Rotation
    const rotate = scrollPercent * 360 * 2;
    
    // Apply transforms
    floatingElement.style.transform = `
        translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))
        scale(${scale})
        rotate(${rotate}deg)
    `;
    
    // Opacity fade in/out
    const opacity = 1 - Math.abs(scrollPercent - 0.5) * 1.5;
    floatingElement.style.opacity = Math.max(0.3, Math.min(1, opacity));
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

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function updateMouseParallax() {
    // Subtle movement based on mouse position
    const orb = floatingElement.querySelector('.glass-orb');
    if (orb) {
        const moveX = mouseX * 20;
        const moveY = mouseY * 20;
        orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }

    requestAnimationFrame(updateMouseParallax);
}

// ===========================
// BUTTON INTERACTION
// ===========================
const glassButton = document.querySelector('.glass-button');
if (glassButton) {
    glassButton.addEventListener('click', () => {
        // Scroll back to top smoothly
        smoothScrollTo(0, 1500);
    });
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
