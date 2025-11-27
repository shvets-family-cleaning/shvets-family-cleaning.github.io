// ========================================
// SHVETS PRO - World-Class JavaScript
// Premium Cleaning Service Website
// ========================================

// ============ PRELOADER ============
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Initialize animations after preloader
            initAnimations();
        }, 1800);
    }
});

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

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
        langSelector?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
        langSelector?.classList.remove('scrolled');
    }
    
    // Show/hide scroll-to-top button
    const scrollTop = document.getElementById('scrollTop');
    if (window.scrollY > 500) {
        scrollTop?.classList.add('visible');
    } else {
        scrollTop?.classList.remove('visible');
    }
});

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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
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
    
    const particleCount = 35;
    
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
    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.animate-reveal');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // On scroll with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
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
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (isDecimal) {
                    counter.textContent = (current / 10).toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    counter.textContent = (target / 10).toFixed(1);
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        updateCounter();
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
    
    const bookingData = getBookingSummary();
    const formData = {
        name: document.getElementById('bookName')?.value || '',
        phone: document.getElementById('bookPhone')?.value || '',
        email: document.getElementById('bookEmail')?.value || '',
        address: document.getElementById('bookAddress')?.value || '',
        date: document.getElementById('bookDate')?.value || '',
        time: document.getElementById('bookTime')?.value || '',
        notes: document.getElementById('bookNotes')?.value || ''
    };
    
    const message = formatBookingMessage(formData, bookingData);
    const whatsappUrl = `https://wa.me/16789376215?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    closeModal();
    
    // Reset form
    this.reset();
    if (bookDate) {
        bookDate.value = new Date().toISOString().split('T')[0];
    }
});

// ============ CONTACT FORM ============
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName')?.value || '',
        phone: document.getElementById('contactPhone')?.value || '',
        email: document.getElementById('contactEmail')?.value || '',
        address: document.getElementById('contactAddress')?.value || '',
        message: document.getElementById('contactMessage')?.value || ''
    };
    
    const message = formatContactMessage(formData);
    const whatsappUrl = `https://wa.me/16789376215?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    this.reset();
});

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
    
    // Handle resize
    window.addEventListener('resize', () => {
        updateSlidesToShow();
        createDots();
        goToSlide(0);
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
    const dotsCount = Math.ceil(totalSlides - slidesToShow + 1);
    
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoSlide();
        });
        sliderDots.appendChild(dot);
    }
}

function goToSlide(index) {
    const maxSlide = totalSlides - slidesToShow;
    
    if (index < 0) {
        currentSlide = maxSlide;
    } else if (index > maxSlide) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    const card = reviewsTrack.querySelector('.review-card');
    if (!card) return;
    
    const cardWidth = card.offsetWidth + 24; // gap
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
        if (value.length > 10) value = value.slice(0, 10);
        
        if (value.length >= 6) {
            this.value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
        } else if (value.length >= 3) {
            this.value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        } else {
            this.value = value;
        }
    });
});

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initReviewsSlider();
    
    // Load saved language
    const savedLang = localStorage.getItem('shvets-lang') || 'en';
    setLanguage(savedLang);
    
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
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
