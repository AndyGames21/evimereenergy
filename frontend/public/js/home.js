/**
 * EVIMERE ENERGY TECHNOLOGIES - SPA Navigation & Scroll Logic
 */

// --- DOM ELEMENTS ---
const btnUp = document.getElementById('scroll-up');
const btnDown = document.getElementById('scroll-down');
const sections = Array.from(document.querySelectorAll('.page-section'));
const navLinks = document.querySelectorAll('.nav-links a');
const menuToggle = document.querySelector('#mobile-menu');
const menuContainer = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const contactBtn = document.getElementById('contactBtn');
const formStatus = document.getElementById('form-status');

// Flag to stop ScrollSpy from fighting manual clicks
let isProcessingNav = false;

// --- 1. INITIALIZATION ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Reset view on fresh load
window.scrollTo(0, 0);

// --- 2. UI UPDATES (Buttons & Active States) ---
const updateUI = () => {
    const scrollPos = window.scrollY;
    
    // Scroll Up Button
    if (btnUp) btnUp.classList.toggle('hidden', scrollPos < 100);

    // Scroll Down Button
    const lastSection = sections[sections.length - 1];
    if (lastSection && btnDown) {
        const rect = lastSection.getBoundingClientRect();
        btnDown.classList.toggle('hidden', rect.top <= 100);
    }
};

// --- 3. SCROLL SPY (URL Sync) ---
const scrollSpyObserver = new IntersectionObserver((entries) => {
    if (isProcessingNav) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const path = id === 'home' ? '/' : `/${id}`;
            
            window.history.replaceState(null, null, path);
            
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                link.classList.toggle('active', linkPath === path);
            });
            updateUI();
        }
    });
}, { threshold: 0.6 });

sections.forEach(section => scrollSpyObserver.observe(section));

// --- 4. NAVIGATION LOGIC ---

const closeMenu = () => {
    if (menuToggle && menuContainer) {
        menuToggle.classList.remove('is-active');
        menuContainer.classList.remove('active');
    }
};

const scrollToSection = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        isProcessingNav = true;
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        closeMenu();

        // Unlock ScrollSpy after animation finishes
        setTimeout(() => { isProcessingNav = false; }, 850);
    }
};

// Global Click Handler
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    // MOBILE MENU: Close if clicking outside
    if (menuContainer && menuContainer.classList.contains('active')) {
        const isClickInsideMenu = menuContainer.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        if (!isClickInsideMenu && !isClickOnToggle) {
            closeMenu();
        }
    }

    if (!link) return;

    const href = link.getAttribute('href');

    // 1. PROTOCOL LINKS (mailto, tel, etc.)
    if (href && (href.includes(':') || link.target === "_blank")) {
        // Let browser handle it; pause SPA logic briefly to prevent jumps
        isProcessingNav = true;
        setTimeout(() => { isProcessingNav = false; }, 500);
        return; 
    }

    // 2. SPA NAVIGATION
    if (href && (href.startsWith('/') || href.startsWith('#'))) {
        e.preventDefault();
        const targetId = (href === '/' || href === '#') ? 'home' : href.replace(/^\/|^#/, '');
        
        if (href.startsWith('/')) {
            window.history.pushState({}, "", href);
        }
        scrollToSection(targetId);
    }
});

// Arrow Controls
const navigate = (direction) => {
    const currentId = window.location.pathname === '/' ? 'home' : window.location.pathname.replace('/', '');
    const idx = sections.findIndex(s => s.id === currentId);
    const targetIdx = direction === 'next' ? idx + 1 : idx - 1;
    
    if (targetIdx >= 0 && targetIdx < sections.length) {
        scrollToSection(sections[targetIdx].id);
    }
};

if (btnDown) btnDown.addEventListener('click', () => navigate('next'));
if (btnUp) btnUp.addEventListener('click', () => navigate('prev'));

window.addEventListener('scroll', () => window.requestAnimationFrame(updateUI));

// --- 5. MOBILE MENU TOGGLE ---
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('is-active');
        menuContainer.classList.toggle('active');
    });
}

// --- 6. CONTACT FORM ---
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        contactBtn.innerText = "SENDING...";
        contactBtn.disabled = true;

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                formStatus.innerText = "Enquiry sent successfully!";
                formStatus.style.color = "#28a745";
                contactForm.reset();
            } else {
                formStatus.innerText = "Failed: " + result.message;
                formStatus.style.color = "#dc3545";
            }
        } catch (err) {
            formStatus.innerText = "Network error. Please try later.";
        } finally {
            contactBtn.innerText = "ENQUIRE NOW";
            contactBtn.disabled = false;
        }
    });
}

// Initial Run
updateUI();