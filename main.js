/**
 * ============================================================================
 * SHVETS PRO - Premium Cleaning Website
 * World-Class JavaScript
 * Version 3.0 - Production Ready
 * ============================================================================
 * 
 * Architecture: Module Pattern with IIFE
 * Performance: Debounced/Throttled Event Handlers
 * Compatibility: ES6+ with Progressive Enhancement
 * 
 * ============================================================================
 */

'use strict';

/**
 * ============================================================================
 * 1. PRELOADER
 * ============================================================================
 */
const Preloader = (() => {
    const preloader = document.getElementById('preloader');
    
    const hide = () => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Initialize animations after preloader
            setTimeout(() => Animations.init(), 100);
        }
    };
    
    const init = () => {
        if (!preloader) return;
        
        // Primary: on window load
        window.addEventListener('load', () => setTimeout(hide, 1500));
        
        // Fallback: after 3 seconds max
        setTimeout(hide, 3000);
    };
    
    return { init, hide };
})();

/**
 * ============================================================================
 * 2. NAVIGATION
 * ============================================================================
 */
const Navigation = (() => {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');
    
    let lastScrollY = 0;
    let ticking = false;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class
        if (scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        // Show/hide scroll to top button
        const scrollTop = document.getElementById('scrollTop');
        if (scrollY > 500) {
            scrollTop?.classList.add('visible');
        } else {
            scrollTop?.classList.remove('visible');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    };
    
    const toggleMenu = () => {
        burger?.classList.toggle('active');
        menu?.classList.toggle('active');
        document.body.style.overflow = menu?.classList.contains('active') ? 'hidden' : '';
    };
    
    const closeMenu = () => {
        burger?.classList.remove('active');
        menu?.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    const init = () => {
        // Scroll handler with requestAnimationFrame
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }, { passive: true });
        
        // Burger click
        burger?.addEventListener('click', toggleMenu);
        
        // Close menu on link click
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Scroll to top
        document.getElementById('scrollTop')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 3. LANGUAGE SELECTOR
 * ============================================================================
 */
const LanguageSelector = (() => {
    const selector = document.getElementById('langSelector');
    const toggle = document.getElementById('langToggle');
    const currentLang = document.getElementById('currentLang');
    const options = document.querySelectorAll('.lang-option');
    
    const open = () => selector?.classList.add('active');
    const close = () => selector?.classList.remove('active');
    const isOpen = () => selector?.classList.contains('active');
    
    const setLanguage = (lang) => {
        // Update active state
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        
        // Update display
        if (currentLang) {
            currentLang.textContent = lang.toUpperCase();
        }
        
        // Apply translations
        if (typeof window.setLanguage === 'function') {
            window.setLanguage(lang);
        }
        
        // Save preference
        localStorage.setItem('shvets-lang', lang);
        
        close();
    };
    
    const init = () => {
        // Toggle dropdown
        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen() ? close() : open();
        });
        
        // Language options
        options.forEach(option => {
            option.addEventListener('click', () => {
                setLanguage(option.dataset.lang);
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!selector?.contains(e.target)) {
                close();
            }
        });
        
        // Load saved language
        const savedLang = localStorage.getItem('shvets-lang');
        if (savedLang) {
            setLanguage(savedLang);
        }
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 4. ANIMATIONS
 * ============================================================================
 */
const Animations = (() => {
    const reveals = document.querySelectorAll('.animate-reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const init = () => {
        reveals.forEach(el => revealObserver.observe(el));
        initCounters();
        initParticles();
    };
    
    // Counter animation
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count) || 0;
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    };
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(start + (target - start) * eased);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    };
    
    // Hero particles
    const initParticles = () => {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        
        const particleCount = window.innerWidth < 768 ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(201, 169, 98, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * -10}s;
            `;
            container.appendChild(particle);
        }
        
        // Add particle animation
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 5. FAQ ACCORDION
 * ============================================================================
 */
const FAQ = (() => {
    const items = document.querySelectorAll('.faq-item');
    
    const toggle = (item) => {
        const isActive = item.classList.contains('active');
        
        // Close all
        items.forEach(i => i.classList.remove('active'));
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    };
    
    const init = () => {
        items.forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => toggle(item));
        });
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 6. MODAL
 * ============================================================================
 */
const Modal = (() => {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = modal?.querySelector('.modal-overlay');
    
    const open = () => {
        modal?.classList.add('active');
        document.body.classList.add('modal-open');
    };
    
    const close = () => {
        modal?.classList.remove('active');
        document.body.classList.remove('modal-open');
    };
    
    const init = () => {
        closeBtn?.addEventListener('click', close);
        overlay?.addEventListener('click', close);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    };
    
    return { init, open, close };
})();

/**
 * ============================================================================
 * 7. FORMS
 * ============================================================================
 */
const Forms = (() => {
    const contactForm = document.getElementById('contactForm');
    const bookingForm = document.getElementById('bookingForm');
    
    const handleContactSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Build WhatsApp message
        const message = `
Hello! I'd like to request a quote.

Name: ${document.getElementById('contactName')?.value || ''}
Phone: ${document.getElementById('contactPhone')?.value || ''}
Email: ${document.getElementById('contactEmail')?.value || ''}
Service: ${document.getElementById('contactService')?.value || ''}
Message: ${document.getElementById('contactMessage')?.value || ''}
        `.trim();
        
        const whatsappUrl = `https://wa.me/16789376215?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    const handleBookingSubmit = (e) => {
        e.preventDefault();
        
        const message = `
New Booking Request!

Name: ${document.getElementById('bookName')?.value || ''}
Phone: ${document.getElementById('bookPhone')?.value || ''}
Email: ${document.getElementById('bookEmail')?.value || ''}
Address: ${document.getElementById('bookAddress')?.value || ''}
Date: ${document.getElementById('bookDate')?.value || ''}
Time: ${document.getElementById('bookTime')?.value || ''}
Notes: ${document.getElementById('bookNotes')?.value || ''}
        `.trim();
        
        const whatsappUrl = `https://wa.me/16789376215?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        Modal.close();
    };
    
    const init = () => {
        contactForm?.addEventListener('submit', handleContactSubmit);
        bookingForm?.addEventListener('submit', handleBookingSubmit);
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 8. BOOK NOW BUTTON
 * ============================================================================
 */
const BookNow = (() => {
    const bookBtn = document.getElementById('bookNowBtn');
    const summary = document.getElementById('bookingSummary');
    
    const handleClick = () => {
        // Get calculator values
        const service = document.querySelector('#serviceOptions .calc-option.active')?.dataset.value || 'standard';
        const bedrooms = document.getElementById('bedrooms')?.value || '3';
        const bathrooms = document.getElementById('bathrooms')?.value || '2';
        const frequency = document.querySelector('#frequencyOptions .calc-option.active')?.dataset.value || 'monthly';
        const price = document.getElementById('totalPrice')?.textContent || '$199';
        
        // Update summary
        if (summary) {
            summary.innerHTML = `
                <strong>${service.charAt(0).toUpperCase() + service.slice(1)} Cleaning</strong><br>
                ${bedrooms} Bed / ${bathrooms} Bath • ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}<br>
                Estimated: <strong>${price}</strong>
            `;
        }
        
        Modal.open();
    };
    
    const init = () => {
        bookBtn?.addEventListener('click', handleClick);
    };
    
    return { init };
})();

/**
 * ============================================================================
 * 9. INITIALIZATION
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    Preloader.init();
    Navigation.init();
    LanguageSelector.init();
    FAQ.init();
    Modal.init();
    Forms.init();
    BookNow.init();
    
    console.log('%c SHVETS PRO ', 'background: #C9A962; color: #0D0D0D; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;', 'Premium Cleaning Website Loaded');
});

// Global function for language system
window.setLanguage = window.setLanguage || function() {};
