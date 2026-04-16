/**
 * El Corazón Auténtico — Main JavaScript
 *
 * Features:
 *  1. Mobile navigation toggle
 *  2. Sticky navbar (hide on scroll-down, reveal on scroll-up)
 *  3. Scroll-triggered fade-in-up animations (Intersection Observer)
 *  4. Animated number counters for stats
 *  5. Scrollspy — active nav link highlights current section
 *  6. Reservation form validation with real-time feedback
 *  7. Form submission simulation with thank-you message
 *  8. Back-to-top button
 *  9. Smooth anchor scrolling (accounting for fixed navbar height)
 * 10. Set minimum booking date to today
 */

'use strict';

/* =========================================================
   DOM REFERENCES
   ========================================================= */
const navbar          = document.getElementById('navbar');
const navToggle       = document.getElementById('nav-toggle');
const navMenu         = document.getElementById('nav-menu');
const backToTopBtn    = document.getElementById('back-to-top');
const bookingForm     = document.getElementById('booking-form');
const formSuccess     = document.getElementById('form-success');
const newReservBtn    = document.getElementById('new-reservation-btn');
const submitBtn       = document.getElementById('submit-btn');
const dateInput       = document.getElementById('res-date');


/* =========================================================
   1. MOBILE NAVIGATION TOGGLE
   ========================================================= */

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');

    // Toggle hamburger → X animation
    navToggle.classList.toggle('is-active', isOpen);

    // Update ARIA for screen readers
    navToggle.setAttribute('aria-expanded', String(isOpen));

    // Lock body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when any nav link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
        navToggle.focus(); // Return focus to toggle button
    }
});


/* =========================================================
   2. STICKY NAVBAR — HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
   ========================================================= */
let lastScrollY     = 0;
let ticking         = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        // Use requestAnimationFrame to throttle scroll handler
        window.requestAnimationFrame(handleNavbarScroll);
        ticking = true;
    }
});

function handleNavbarScroll() {
    const currentScrollY = window.scrollY;

    // Add 'scrolled' class once user scrolls past 80px (hero area)
    navbar.classList.toggle('scrolled', currentScrollY > 80);

    // Hide navbar when scrolling down, reveal when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 300) {
        // Scrolling down — hide navbar
        navbar.classList.add('nav-hidden');
        // Always close mobile menu when hiding navbar
        if (navMenu.classList.contains('is-open')) closeMobileMenu();
    } else {
        // Scrolling up — show navbar
        navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
}


/* =========================================================
   3. SCROLL-TRIGGERED FADE-IN-UP ANIMATIONS
   Uses the Intersection Observer API for performance.
   CSS class .fade-in-up starts elements as opacity:0 + translateY(36px).
   This script adds .is-visible when the element enters the viewport.
   ========================================================= */
const fadeElements = document.querySelectorAll('.fade-in-up');

const fadeObserverOptions = {
    threshold: 0.12,         // Trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px' // Start slightly before bottom edge
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target); // Fire only once per element
        }
    });
}, fadeObserverOptions);

fadeElements.forEach(el => fadeObserver.observe(el));


/* =========================================================
   4. ANIMATED NUMBER COUNTERS FOR STATS
   Counts up from 0 to the data-count value when stat
   section enters the viewport.
   ========================================================= */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target   = parseInt(element.dataset.count, 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure exact final value
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));


/* =========================================================
   5. SCROLLSPY — HIGHLIGHT ACTIVE NAV LINK
   Watches which section is currently most visible in the
   viewport and marks the corresponding nav link as active.
   ========================================================= */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], footer[id]');

const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Find the matching link and activate it
            const activeLink = document.querySelector(
                `.nav-link[href="#${entry.target.id}"]`
            );
            if (activeLink) activeLink.classList.add('active');
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-15% 0px -70% 0px' // Fire when section is in the upper portion of viewport
});

sections.forEach(section => scrollspyObserver.observe(section));


/* =========================================================
   6. BACK TO TOP BUTTON
   ========================================================= */
window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =========================================================
   7. STICKY MOBILE CTA BAR
   ========================================================= */
const stickyCta = document.getElementById('sticky-cta');

if (stickyCta) {
    window.addEventListener('scroll', () => {
        // Show after 300px scroll, hide if near top
        if (window.scrollY > 300) {
            stickyCta.classList.remove('sticky-cta--hidden');
        } else {
            stickyCta.classList.add('sticky-cta--hidden');
        }
    }, { passive: true });
}


/* =========================================================
   8. SMOOTH ANCHOR SCROLLING (accounts for fixed navbar)
   Intercepts all internal links starting with # and
   applies smooth scrolling offset by navbar height.
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignore bare "#" links
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarHeight = navbar.offsetHeight;
        const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });

        // Close mobile menu if open
        if (navMenu.classList.contains('is-open')) closeMobileMenu();
    });
});


/* =========================================================
   8. RESERVATION FORM — MINIMUM DATE
   Prevent users from selecting a date in the past.
   ========================================================= */
(function setMinDate() {
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
})();


/* =========================================================
   9. RESERVATION FORM — VALIDATION
   ========================================================= */

/**
 * Validates a single form field.
 * @param {HTMLElement} field - The input or select element to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateField(field) {
    const errorEl  = document.getElementById(`${field.id}-error`);
    let   isValid  = true;
    let   message  = '';

    // Remove existing state classes
    field.classList.remove('field-valid', 'field-invalid');

    /* ── Required check ── */
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'Toto pole je povinné.';
    }

    /* ── Email format check ── */
    else if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
            isValid = false;
            message = 'Prosím zadejte platnou e-mailovou adresu.';
        }
    }

    /* ── Future date check ── */
    else if (field.id === 'res-date' && field.value) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (field.value < todayStr) {
            isValid = false;
            message = 'Prosím vyberte datum v budoucnosti.';
        }
    }

    // Update error message
    if (errorEl) {
        errorEl.textContent = message;
    }

    // Apply visual state class
    field.classList.add(isValid ? 'field-valid' : 'field-invalid');

    return isValid;
}

// Real-time validation: validate on blur, re-validate on input if already invalid
if (bookingForm) {
    bookingForm.querySelectorAll('input[required], select[required]').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('field-invalid')) {
                validateField(field);
            }
        });
    });
}


/* =========================================================
   10. RESERVATION FORM — SUBMISSION
   ========================================================= */
if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isFormValid = true;
        const requiredFields = bookingForm.querySelectorAll('input[required], select[required]');

        // Validate all required fields at once
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // If validation fails, scroll to the first error and stop
        if (!isFormValid) {
            const firstInvalid = bookingForm.querySelector('.field-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        // Show loading state on the submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Zpracovávání...';

        /**
         * Simulate an async API call (replace setTimeout with a real fetch() call).
         * Example with real API:
         *
         *   const formData = new FormData(bookingForm);
         *   fetch('/api/reservations', { method: 'POST', body: formData })
         *     .then(res => res.json())
         *     .then(showSuccess)
         *     .catch(handleError);
         */
        setTimeout(() => {
            showSuccessMessage();
        }, 1400);
    });
}

/** Shows the thank-you state and hides the form */
function showSuccessMessage() {
    bookingForm.style.display = 'none';
    formSuccess.classList.add('visible');
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Move focus to the success heading for accessibility
    const successHeading = formSuccess.querySelector('h3');
    if (successHeading) {
        successHeading.setAttribute('tabindex', '-1');
        successHeading.focus();
    }
}

/** "Make Another Reservation" button resets and shows the form again */
if (newReservBtn) {
    newReservBtn.addEventListener('click', () => {
        // Hide success, show form
        formSuccess.classList.remove('visible');
        bookingForm.style.display = 'flex';

        // Reset all field values and validation classes
        bookingForm.reset();
        bookingForm.querySelectorAll('.field-valid, .field-invalid').forEach(el => {
            el.classList.remove('field-valid', 'field-invalid');
        });
        bookingForm.querySelectorAll('.field-error').forEach(el => {
            el.textContent = '';
        });

        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-calendar-check" aria-hidden="true"></i> Potvrdit rezervaci';

        // Scroll back to form
        bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}


/* =========================================================
   11. UTILITY — PAGE-LOAD PERFORMANCE
   Mark .fade-in-up elements above the fold as visible
   immediately (no delay on first paint).
   ========================================================= */
(function revealAboveFold() {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('is-visible');
        }
    });
})();
