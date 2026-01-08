// Reset Scroll and URL Behavior for SPA Navigation
// 1. Force Scroll to Top on Refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual'; // Prevents browser from remembering scroll position
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0); // Jump to top right before the reload happens
});

// 2. Reset URL to Home on Load
if (window.location.pathname !== '/') {
    window.history.replaceState({}, "", "/");
}

// Function to handle routing and scrolling
const handleRouting = (isInitialLoad = false) => {
    const path = window.location.pathname;
    // Map '/' to 'home', otherwise strip the '/'
    const targetId = path === '/' ? 'home' : path.replace('/', '');
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
        targetSection.scrollIntoView({ 
            behavior: isInitialLoad ? 'auto' : 'smooth', 
            block: 'start' 
        });
    }
};

// History API Based SPA Navigation
// 1. Handle Clicks (The "No-Refresh" Part)
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a, .btn');
    if (!link) return;

    const href = link.getAttribute('href');

    // If it's an internal link, stop the refresh
    if (href.startsWith('/')) {
        e.preventDefault(); 
        
        // Update URL bar
        window.history.pushState({}, "", href);
        
        // Scroll smoothly
        handleRouting();
    }
});

// 2. Handle Direct Refresh & Initial Load
window.addEventListener('load', () => {
    // We use 'auto' on load so it jumps to the section immediately 
    // without a long scrolling animation from the top.
    handleRouting(true);
});

// 3. Handle Back/Forward Buttons
window.addEventListener('popstate', () => handleRouting());

// Scroll Button
const btnUp = document.getElementById('scroll-up');
const btnDown = document.getElementById('scroll-down');
const sections = Array.from(document.querySelectorAll('.page-section'));

/**
 * Update button visibility based on scroll position
 */
const updateButtons = () => {
    const scrollPos = window.scrollY;
    
    // 1. Logic for 'Up' Button: Hide if at the very top (Home)
    if (scrollPos < 100) {
        btnUp.classList.add('hidden');
    } else {
        btnUp.classList.remove('hidden');
    }

    // 2. Logic for 'Down' Button: Hide if at the last section (Contact)
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
        const rect = lastSection.getBoundingClientRect();
        // If the top of the contact section is within 100px of the top of the viewport
        if (rect.top <= 100) {
            btnDown.classList.add('hidden');
        } else {
            btnDown.classList.remove('hidden');
        }
    }
};

/**
 * Handle smooth scrolling between sections
 */
const scrollToNext = (direction) => {
    // Determine current section based on URL path
    const currentPath = window.location.pathname;
    const currentId = currentPath === '/' ? 'home' : currentPath.replace('/', '');
    const currentIndex = sections.findIndex(s => s.id === currentId);

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    // Boundary check to ensure we don't scroll past the array limits
    if (targetIndex >= 0 && targetIndex < sections.length) {
        const targetSection = sections[targetIndex];
        
        // Update URL bar for professional SPA feel
        const newPath = targetSection.id === 'home' ? '/' : `/${targetSection.id}`;
        window.history.pushState({}, "", newPath);

        // Perform the smooth scroll
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
};

/**
 * Handle global link clicks for SPA behavior
 * Intercepts navbar and section buttons
 */
document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a, a.btn');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
        e.preventDefault();
        
        const targetId = href === '/' ? 'home' : href.replace('/', '');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.history.pushState({}, "", href);
            targetSection.scrollIntoView({ behavior: 'smooth' });
            // Manually trigger button update in case scroll event is delayed
            setTimeout(updateButtons, 500); 
        }
    }
});

/**
 * Event Listeners
 */
btnDown.addEventListener('click', () => scrollToNext('next'));
btnUp.addEventListener('click', () => scrollToNext('prev'));

// Listen for browser Back/Forward buttons
window.addEventListener('popstate', () => {
    const path = window.location.pathname;
    const targetId = path === '/' ? 'home' : path.replace('/', '');
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Optimized Scroll Listener
window.addEventListener('scroll', () => {
    // RequestAnimationFrame ensures UI updates stay in sync with display refresh rate
    window.requestAnimationFrame(updateButtons);
});

// Set initial state on page load
window.addEventListener('DOMContentLoaded', updateButtons);
