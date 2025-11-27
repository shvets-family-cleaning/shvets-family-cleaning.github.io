// ========================================
// SHVETS PRO - World-Class JavaScript
// Premium Cleaning Service Website
// Version 2.0 - Production Ready
// ========================================

// ============ PRELOADER - BULLETPROOF ============
(function() {
    'use strict';
    
    function hidePreloader() {
        try {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                preloader.style.pointerEvents = 'none';
                preloader.classList.add('hidden');
                
                // Try to init animations, but don't block if it fails
                try {
                    if (typeof initAnimations === 'function') {
                        initAnimations();
                    }
                } catch(e) {
                    console.warn('Animation init failed:', e);
                }
            }
        } catch(e) {
            console.error('Preloader error:', e);
            // Force hide preloader element directly
            const p = document.getElementById('preloader');
            if (p) p.style.display = 'none';
        }
    }
    
    // Method 1: On window load
    window.addEventListener('load', function() {
        setTimeout(hidePreloader, 1200);
    });
    
    // Method 2: On DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(hidePreloader, 2000);
    });
    
    // Method 3: Absolute fallback - WILL hide in 3 seconds NO MATTER WHAT
    setTimeout(hidePreloader, 3000);
    
    // Method 4: Even more aggressive fallback
    setTimeout(function() {
        const p = document.getElementById('preloader');
        if (p && p.style.display !== 'none') {
            p.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }, 5000);
})();

// ============ LANGUAGE SELECTOR ============
const langSelector = document.getElementById('langSelector');
const langToggle = document.getElementById('langToggle');
const langDropdown = document.getElementById('langDropdown');
const currentLang = document.getElementById('currentLang');

langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelector.classList.toggle('active');
});

document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function() {
        const lang = this.dataset.lang;
        
        // Update active state
        document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Update current language display
        currentLang.textContent = lang.toUpperCase();
        
        // Close dropdown
        langSelector.classList.remove('active');
        
        // Apply translations
        setLanguage(lang);
    });
});

// Close on outside click
document.addEventListener('click', () => {
    langSelector?.classList.remove('active');
});

// ============ NAVIGATION ============
const navbar = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');

// Scroll effect with throttle for performance
let lastScrollY = 0;
let ticking = false;

function updateNavOnScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar?.classList.add('scrolled');
        langSelector?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
        langSelector?.classList.remove('scrolled');
    }
    
    // Show/hide scroll-to-top button
    const scrollTop = document.getElementById('scrollTop');
    if (scrollY > 500) {
        scrollTop?.classList.add('visible');
    } else {
        scrollTop?.classList.remove('visible');
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavOnScroll);
        ticking = true;
    }
}, { passive: true });

// Mobile menu toggle
navBurger?.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navBurger?.classList.remove('active');
        navMenu?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============ SMOOTH SCROLL ============
// FIXED: Only handle anchor links, not tel:, mailto:, or external links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = navbar?.offsetHeight || 80;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to top button
document.getElementById('scrollTop')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============ HERO PARTICLES ============
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 35;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (20 + Math.random() * 15) + 's';
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============ SCROLL ANIMATIONS ============
function initAnimations() {
    const reveals = document.querySelectorAll('.animate-reveal');
    
    // Use IntersectionObserver for better performance
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after revealing
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    reveals.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Counter animation
    initCounters();
}

// ============ COUNTER ANIMATION ============
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const isDecimal = counter.dataset.decimal === 'true';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * easeOut;
            
            if (isDecimal) {
                counter.textContent = (current / 10).toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                if (isDecimal) {
                    counter.textContent = (target / 10).toFixed(1);
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ============ BOOKING MODAL ============
const bookNowBtn = document.getElementById('bookNowBtn');
const bookingModal = document.getElementById('bookingModal');
const modalClose = document.getElementById('modalClose');
const bookingSummary = document.getElementById('bookingSummary');
const bookingForm = document.getElementById('bookingForm');

// Open modal
bookNowBtn?.addEventListener('click', () => {
    const summary = getBookingSummary();
    
    if (bookingSummary) {
        bookingSummary.innerHTML = `
            <strong>${summary.serviceName}</strong><br>
            ${summary.bedrooms} ${summary.bedroomText}, ${summary.bathrooms} ${summary.bathroomText}<br>
            <span style="font-size: 1.3rem; color: var(--gold); font-weight: 700;">$${summary.price}</span>
        `;
    }
    
    bookingModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input for accessibility
    setTimeout(() => {
        document.getElementById('bookName')?.focus();
    }, 100);
});

// Close modal
function closeModal() {
    bookingModal?.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);

// Close on overlay click
bookingModal?.addEventListener('click', (e) => {
    if (e.target === bookingModal || e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal?.classList.contains('active')) {
        closeModal();
    }
});

// Set minimum date to today
const bookDate = document.getElementById('bookDate');
if (bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.setAttribute('min', today);
    bookDate.value = today;
}

// Booking form submission
bookingForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }
    
    const bookingData = getBookingSummary();
    const formData = {
        name: document.getElementById('bookName')?.value?.trim() || '',
        phone: document.getElementById('bookPhone')?.value?.trim() || '',
        email: document.getElementById('bookEmail')?.value?.trim() || '',
        address: document.getElementById('bookAddress')?.value?.trim() || '',
        date: document.getElementById('bookDate')?.value || '',
        time: document.getElementById('bookTime')?.value || '',
        notes: document.getElementById('bookNotes')?.value?.trim() || ''
    };
    
    const message = formatBookingMessage(formData, bookingData);
    const whatsappUrl = `https://wa.me/16789376215?text=${message}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    closeModal();
    
    // Reset form
    this.reset();
    if (bookDate) {
        const today = new Date().toISOString().split('T')[0];
        bookDate.value = today;
    }
    
    // Show success feedback
    showNotification('Booking request sent! We\'ll contact you shortly.', 'success');
});

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }
    
    const formData = {
        name: document.getElementById('contactName')?.value?.trim() || '',
        phone: document.getElementById('contactPhone')?.value?.trim() || '',
        email: document.getElementById('contactEmail')?.value?.trim() || '',
        address: document.getElementById('contactAddress')?.value?.trim() || '',
        message: document.getElementById('contactMessage')?.value?.trim() || ''
    };
    
    const message = formatContactMessage(formData);
    const whatsappUrl = `https://wa.me/16789376215?text=${message}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    this.reset();
    
    // Show success feedback
    showNotification('Message sent! We\'ll get back to you soon.', 'success');
});

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #1a1a1a;
                color: #fff;
                padding: 16px 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                opacity: 0;
                transition: all 0.3s ease;
            }
            .notification.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            .notification-success {
                border-left: 4px solid #C9A962;
            }
            .notification-success i {
                color: #C9A962;
            }
            .notification i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============ REVIEWS SLIDER ============
const reviewsTrack = document.querySelector('.reviews-track');
const prevBtn = document.getElementById('prevReview');
const nextBtn = document.getElementById('nextReview');
const sliderDots = document.getElementById('sliderDots');

let currentSlide = 0;
let slidesToShow = 3;
let totalSlides = 0;
let autoSlideInterval;

function initReviewsSlider() {
    if (!reviewsTrack) return;
    
    const cards = reviewsTrack.querySelectorAll('.review-card');
    totalSlides = cards.length;
    
    // Determine slides to show based on screen width
    updateSlidesToShow();
    
    // Create dots
    createDots();
    
    // Add event listeners
    prevBtn?.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
    });
    
    nextBtn?.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
    });
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    reviewsTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    reviewsTrack.addEventListener('mouseleave', startAutoSlide);
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    reviewsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    reviewsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
            resetAutoSlide();
        }
    }
    
    // Handle resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlidesToShow();
            createDots();
            goToSlide(0);
        }, 250);
    });
}

function updateSlidesToShow() {
    if (window.innerWidth <= 768) {
        slidesToShow = 1;
    } else if (window.innerWidth <= 1024) {
        slidesToShow = 2;
    } else {
        slidesToShow = 3;
    }
}

function createDots() {
    if (!sliderDots) return;
    
    sliderDots.innerHTML = '';
    const dotsCount = Math.max(1, totalSlides - slidesToShow + 1);
    
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoSlide();
        });
        sliderDots.appendChild(dot);
    }
}

function goToSlide(index) {
    const maxSlide = Math.max(0, totalSlides - slidesToShow);
    
    if (index < 0) {
        currentSlide = maxSlide;
    } else if (index > maxSlide) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    const card = reviewsTrack.querySelector('.review-card');
    if (!card) return;
    
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight || 0) + 24; // gap
    reviewsTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    
    // Update dots
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// ============ PHONE NUMBER FORMATTING ============
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        // Handle US phone numbers
        if (value.length > 10) {
            // If starts with 1, allow 11 digits
            if (value.startsWith('1')) {
                value = value.slice(0, 11);
            } else {
                value = value.slice(0, 10);
            }
        }
        
        // Format based on length
        if (value.length >= 7) {
            if (value.startsWith('1') && value.length > 1) {
                // Format: +1 (XXX) XXX-XXXX
                this.value = `+1 (${value.slice(1,4)}) ${value.slice(4,7)}-${value.slice(7)}`;
            } else if (value.length >= 6) {
                this.value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            }
        } else if (value.length >= 4) {
            this.value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        } else {
            this.value = value;
        }
    });
    
    // Allow only numbers on keypress
    input.addEventListener('keypress', function(e) {
        if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            // Allow paste
            if (!(e.ctrlKey && e.key === 'v') && !(e.metaKey && e.key === 'v')) {
                e.preventDefault();
            }
        }
    });
});

// ============ EMAIL VALIDATION ============
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.setCustomValidity('Please enter a valid email address');
            this.classList.add('invalid');
        } else {
            this.setCustomValidity('');
            this.classList.remove('invalid');
        }
    });
    
    input.addEventListener('input', function() {
        this.setCustomValidity('');
        this.classList.remove('invalid');
    });
});

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReviewsSlider();
    
    // Load saved language
    const savedLang = localStorage.getItem('shvets-lang') || 'en';
    if (typeof setLanguage === 'function') {
        setLanguage(savedLang);
    }
    
    // Update language selector display
    if (currentLang) {
        currentLang.textContent = savedLang.toUpperCase();
    }
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === savedLang);
    });
    
    // Add loading="lazy" to images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Prevent flash of unstyled content
    document.body.classList.add('loaded');
});

// ============ PERFORMANCE: Debounce utility ============
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============ ACCESSIBILITY ============
// Focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Apply focus trap to modal
if (bookingModal) {
    trapFocus(bookingModal);
}

// ============ ERROR HANDLING ============
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message);
    // Optionally send to analytics
});

// ============ PREVENT DOUBLE FORM SUBMISSION ============
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Re-enable after 3 seconds as fallback
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 3000);
        }
    });
});

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
        }
    });
});

// ============ SMART EMAIL HANDLER ============
// Provides fallback to Gmail web if mailto: doesn't work
window.handleEmailClick = function(e, email) {
    // Check if mailto handler exists
    const mailtoSupported = (() => {
        // Mobile devices usually have mail apps
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            return true;
        }
        // Desktop - try to detect if handler is registered
        // This is tricky, so we provide a choice
        return false;
    })();
    
    // On desktop without obvious mail client, offer choice
    if (!mailtoSupported && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        
        // Show email options modal
        const choice = confirm(
            `📧 Open email to: ${email}\n\n` +
            `Click OK to open Gmail in browser\n` +
            `Click Cancel to try your default email app`
        );
        
        if (choice) {
            // Open Gmail compose
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Cleaning Service Inquiry')}&body=${encodeURIComponent('Hi SHVETS PRO team,\n\nI would like to inquire about your cleaning services.\n\n')}`;
            window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        } else {
            // Try mailto anyway
            window.location.href = `mailto:${email}`;
        }
    }
    // On mobile or with modifier key, let default mailto work
};

// Also handle email links without onclick
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    if (!link.hasAttribute('onclick')) {
        link.addEventListener('click', function(e) {
            const email = this.href.replace('mailto:', '').split('?')[0];
            handleEmailClick(e, email);
        });
    }
});
