/**
 * EVIMERE ENERGY TECHNOLOGIES - SPA Navigation & Scroll Logic
 */

const btnUp = document.getElementById('scroll-up');
const btnDown = document.getElementById('scroll-down');
// We target .page-section for logic as requested
const sections = Array.from(document.querySelectorAll('.page-section'));
const navLinks = document.querySelectorAll('.nav-links a');

// --- 1. REFRESH & LOAD BEHAVIOR ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Force back to top/home on full refresh
if (window.location.pathname !== '/') {
    window.history.replaceState({}, "", "/");
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// --- 2. BUTTON VISIBILITY LOGIC ---
const updateButtons = () => {
    const scrollPos = window.scrollY;
    
    // Up button: hide if at top
    if (scrollPos < 100) {
        btnUp.classList.add('hidden');
    } else {
        btnUp.classList.remove('hidden');
    }

    // Down button: hide if at last section (Contact)
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
        const rect = lastSection.getBoundingClientRect();
        if (rect.top <= 100) {
            btnDown.classList.add('hidden');
        } else {
            btnDown.classList.remove('hidden');
        }
    }
};

// --- 3. SCROLL SPY & URL SYNC (The "Manual Scroll" Fix) ---
// This observes which section is currently in view
const scrollSpyOptions = {
    threshold: 0.5, // Trigger when 50% of section is visible
    rootMargin: "-10% 0px -10% 0px" 
};

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const path = id === 'home' ? '/' : `/${id}`;
            
            // Update URL without creating a massive back-button history
            window.history.replaceState(null, null, path);
            
            // Update Navbar Active State
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                link.classList.toggle('active', linkPath === path);
            });

            updateButtons();
        }
    });
}, scrollSpyOptions);

sections.forEach(section => scrollSpyObserver.observe(section));

// --- 4. NAVIGATION LOGIC (Buttons & Links) ---

const scrollToNext = (direction) => {
    const currentPath = window.location.pathname;
    const currentId = currentPath === '/' ? 'home' : currentPath.replace('/', '');
    const currentIndex = sections.findIndex(s => s.id === currentId);

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < sections.length) {
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
    }
};

// Global click interceptor for all internal links
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a, .btn, .btn-primary, .btn-outline');
    if (!link) return;

    const href = link.getAttribute('href');

    if (href && href.startsWith('/')) {
        e.preventDefault(); 
        
        const targetId = href === '/' ? 'home' : href.replace('/', '');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // PushState for manual clicks so the Back button works
            window.history.pushState({}, "", href);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// --- 5. EVENT LISTENERS ---

btnDown.addEventListener('click', () => scrollToNext('next'));
btnUp.addEventListener('click', () => scrollToNext('prev'));

window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const targetId = path === '/' ? 'home' : path.replace('/', '');
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateButtons);
});

// Set initial state
updateButtons();

// Contact Form Submission Logic
const contactForm = document.getElementById('contact-form');
const contactBtn = document.getElementById('contactBtn');
const formStatus = document.getElementById('form-status'); // New selector

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            firstName: formData.get('firstName'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Reset status message and button
        formStatus.innerText = "";
        contactBtn.innerText = "SENDING...";
        contactBtn.disabled = true;

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                formStatus.innerText = "Enquiry sent successfully!";
                formStatus.style.color = "#28a745"; 
                contactForm.reset();

                setTimeout(() => {
                    formStatus.innerText = "";
                }, 5000);
            } else {
                // SERVER ERROR
                formStatus.innerText = "Error: " + (result.message || "Something went wrong.");
                formStatus.style.color = "#dc3545";
            }
        } catch (error) {
            formStatus.innerText = "Could not connect to server.";
            formStatus.style.color = "#dc3545";
        } finally {
            contactBtn.innerText = "ENQUIRE NOW";
            contactBtn.disabled = false;
        }
    });
}

// Hamburger Menu Logic
// Mobile Menu Logic
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// Close menu when a link is clicked (useful for one-page scrolling)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    });
});

document.addEventListener('click', function(event) {
    const isClickInsideMenu = menuLinks.contains(event.target);
    const isClickInsideToggle = menu.contains(event.target);

    // If the menu is open and the user clicks outside both the menu and the button
    if (menuLinks.classList.contains('active') && !isClickInsideMenu && !isClickInsideToggle) {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    }
});