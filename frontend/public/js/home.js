/**
 * EVIMERE ENERGY TECHNOLOGIES - Final SPA Navigation
 */

// --- 1. DOM ELEMENTS ---
const btnUp = document.getElementById('scroll-up');
const btnDown = document.getElementById('scroll-down');
const sections = Array.from(document.querySelectorAll('.page-section'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const menuToggle = document.querySelector('#mobile-menu');
const menuContainer = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const contactBtn = document.getElementById('contactBtn');
const formStatus = document.getElementById('form-status');

// --- 2. CORE UTILITIES ---

const updateActiveState = (activeId) => {
    const path = activeId === 'home' ? '/' : `/${activeId}`;
    
    // Sync URL only if it changed
    if (window.location.pathname !== path) {
        window.history.replaceState(null, null, path);
    }

    // Sync Navbar links
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.toggle('active', linkPath === path);
    });

    // Handle Scroll Up Button Visibility
    if (btnUp) btnUp.classList.toggle('hidden', window.scrollY < 200);

    // Handle Scroll Down Button Visibility (hide at footer)
    if (btnDown) {
        const lastSection = sections[sections.length - 1];
        const rect = lastSection.getBoundingClientRect();
        btnDown.classList.toggle('hidden', rect.top <= 100);
    }
};

// --- 3. SCROLL LOGIC ---

const handleScroll = () => {
    let currentSectionId = "home";
    const triggerBottom = window.innerHeight / 3; // Trigger when section is 1/3 up the screen

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            currentSectionId = section.id;
        }
    });

    updateActiveState(currentSectionId);
};

const scrollToSection = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        // Close mobile menu
        menuToggle?.classList.remove('is-active');
        menuContainer?.classList.remove('active');

        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// --- 4. EVENT LISTENERS ---

// A. Navigation Clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    // Click outside mobile menu logic
    if (menuContainer?.classList.contains('active')) {
        if (!menuContainer.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('is-active');
            menuContainer.classList.remove('active');
        }
    }

    if (!link) return;
    const href = link.getAttribute('href');

    // Ignore protocol links
    if (href?.includes(':') || link.target === "_blank") return;

    // SPA Navigation
    if (href?.startsWith('/') || href?.startsWith('#')) {
        e.preventDefault();
        const targetId = (href === '/' || href === '#') ? 'home' : href.replace(/^\/|^#/, '');
        
        // Push state for back button support
        if (href.startsWith('/')) window.history.pushState({}, "", href);
        scrollToSection(targetId);
    }
});

// B. Up/Down Arrow Logic
const navigateStep = (direction) => {
    let currentIdx = 0;
    let minDistance = Infinity;

    // Find section closest to the top
    sections.forEach((section, index) => {
        const distance = Math.abs(section.getBoundingClientRect().top);
        if (distance < minDistance) {
            minDistance = distance;
            currentIdx = index;
        }
    });

    const targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx >= 0 && targetIdx < sections.length) {
        scrollToSection(sections[targetIdx].id);
    }
};

btnDown?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateStep('next');
});

btnUp?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateStep('prev');
});

// C. Scroll and Form
window.addEventListener('scroll', handleScroll, { passive: true });

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('is-active');
        menuContainer.classList.toggle('active');
    });
}

// --- 5. CONTACT FORM ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        contactBtn.innerText = "SENDING...";
        contactBtn.disabled = true;

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
            });
            const result = await response.json();
            formStatus.innerText = result.success ? "Sent successfully!" : result.message;
            formStatus.style.color = result.success ? "#28a745" : "#dc3545";
            if (result.success) contactForm.reset();
        } catch {
            formStatus.innerText = "Error sending message.";
        } finally {
            contactBtn.innerText = "ENQUIRE NOW";
            contactBtn.disabled = false;
        }
    });
}

// --- 6. STARTUP ---
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
handleScroll();