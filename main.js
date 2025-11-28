/**
 * ============================================================================
 * SHVETS PRO - Premium Cleaning Website
 * Version 4.0 - Production Ready
 * ============================================================================
 */

'use strict';

// ============================================================================
// 1. PRELOADER - Bulletproof Implementation
// ============================================================================
(function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    let hidden = false;
    
    const hidePreloader = () => {
        if (hidden) return;
        hidden = true;
        
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        preloader.style.pointerEvents = 'none';
        
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
        
        document.body.style.overflow = '';
    };
    
    // Method 1: Window load with delay
    window.addEventListener('load', () => setTimeout(hidePreloader, 1200));
    
    // Method 2: DOM ready fallback
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 500);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 2000));
    }
    
    // Method 3: Absolute timeout (always works)
    setTimeout(hidePreloader, 3000);
})();

// ============================================================================
// 2. NAVIGATION
// ============================================================================
const Navigation = (() => {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('navMenu');
    let ticking = false;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        
        // Show/hide scroll to top button
        const scrollTop = document.getElementById('scrollTop');
        if (scrollTop) {
            scrollTop.classList.toggle('visible', scrollY > 500);
        }
        
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
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Scroll to top button
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
                    closeMenu();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });
    };
    
    return { init };
})();

// ============================================================================
// 3. LANGUAGE SELECTOR
// ============================================================================
const LanguageSelector = (() => {
    const selector = document.getElementById('langSelector');
    const toggle = document.getElementById('langToggle');
    const currentLang = document.getElementById('currentLang');
    const options = document.querySelectorAll('.lang-option');
    
    const close = () => selector?.classList.remove('active');
    const isOpen = () => selector?.classList.contains('active');
    
    const setLanguage = (lang) => {
        options.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        
        if (currentLang) {
            currentLang.textContent = lang.toUpperCase();
        }
        
        // Apply translations if available
        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations(lang);
        }
        
        localStorage.setItem('shvets-lang', lang);
        close();
    };
    
    const init = () => {
        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            selector?.classList.toggle('active');
        });
        
        options.forEach(option => {
            option.addEventListener('click', () => setLanguage(option.dataset.lang));
        });
        
        document.addEventListener('click', (e) => {
            if (!selector?.contains(e.target)) close();
        });
        
        // Load saved language
        const savedLang = localStorage.getItem('shvets-lang');
        if (savedLang) {
            setLanguage(savedLang);
        }
    };
    
    return { init };
})();

// ============================================================================
// 4. ANIMATIONS
// ============================================================================
const Animations = (() => {
    const init = () => {
        const reveals = document.querySelectorAll('.animate-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });
        
        reveals.forEach(el => observer.observe(el));
        
        // Counter animations
        initCounters();
        
        // Particles
        initParticles();
    };
    
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || 0;
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(c => observer.observe(c));
    };
    
    const animateCounter = (el, target) => {
        const duration = 2000;
        const start = performance.now();
        
        const update = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    };
    
    const initParticles = () => {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        
        const count = window.innerWidth < 768 ? 15 : 25;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(201, 169, 98, ${Math.random() * 0.4 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleDrift ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: -${Math.random() * 10}s;
            `;
            container.appendChild(particle);
        }
        
        // Add keyframes
        if (!document.getElementById('particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = `
                @keyframes particleDrift {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    return { init };
})();

// ============================================================================
// 5. FAQ ACCORDION
// ============================================================================
const FAQ = (() => {
    const init = () => {
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            question?.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                
                // Toggle clicked
                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    };
    
    return { init };
})();

// ============================================================================
// 6. MODAL
// ============================================================================
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

// ============================================================================
// 7. BOOK NOW BUTTON
// ============================================================================
const BookNow = (() => {
    const init = () => {
        const bookBtn = document.getElementById('bookNowBtn');
        const summary = document.getElementById('bookingSummary');
        
        bookBtn?.addEventListener('click', () => {
            // Get data from calculator if available
            let summaryText = 'Cleaning Service';
            
            if (window.Calculator && typeof window.Calculator.getBookingSummary === 'function') {
                const data = window.Calculator.getBookingSummary();
                summaryText = `
                    <strong>${data.service}</strong><br>
                    ${data.bedrooms} Bed / ${data.bathrooms} Bath • ${data.frequency}<br>
                    Estimated: <strong>$${data.price}</strong>
                `;
            } else {
                // Fallback: read from DOM
                const service = document.querySelector('#serviceOptions .calc-option.active')?.querySelector('span')?.textContent || 'Cleaning';
                const price = document.getElementById('totalPrice')?.textContent || '$199';
                summaryText = `<strong>${service}</strong> - ${price}`;
            }
            
            if (summary) {
                summary.innerHTML = summaryText;
            }
            
            Modal.open();
        });
    };
    
    return { init };
})();

// ============================================================================
// 8. FORMS
// ============================================================================
const Forms = (() => {
    const createWhatsAppMessage = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return '';
        
        const fields = {};
        form.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.id && el.value) {
                fields[el.id] = el.value;
            }
        });
        
        if (formId === 'contactForm') {
            return `Hello! I'd like to request a quote.

Name: ${fields.contactName || ''}
Phone: ${fields.contactPhone || ''}
Email: ${fields.contactEmail || ''}
Service: ${fields.contactService || ''}
Message: ${fields.contactMessage || ''}`;
        }
        
        if (formId === 'bookingForm') {
            let bookingInfo = '';
            if (window.Calculator) {
                const data = window.Calculator.getBookingSummary();
                bookingInfo = `Service: ${data.service}
Bedrooms: ${data.bedrooms}
Bathrooms: ${data.bathrooms}
Frequency: ${data.frequency}
Price: $${data.price}`;
            }
            
            return `🏠 NEW BOOKING REQUEST

${bookingInfo}

Name: ${fields.bookName || ''}
Phone: ${fields.bookPhone || ''}
Email: ${fields.bookEmail || ''}
Address: ${fields.bookAddress || ''}
Date: ${fields.bookDate || ''}
Time: ${fields.bookTime || ''}
Notes: ${fields.bookNotes || ''}`;
        }
        
        return '';
    };
    
    const init = () => {
        // Contact form
        document.getElementById('contactForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = createWhatsAppMessage('contactForm');
            window.open(`https://wa.me/16789376215?text=${encodeURIComponent(msg)}`, '_blank');
        });
        
        // Booking form
        document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = createWhatsAppMessage('bookingForm');
            window.open(`https://wa.me/16789376215?text=${encodeURIComponent(msg)}`, '_blank');
            Modal.close();
        });
    };
    
    return { init };
})();

// ============================================================================
// 9. INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    LanguageSelector.init();
    FAQ.init();
    Modal.init();
    Forms.init();
    BookNow.init();
    
    // Animations after short delay
    setTimeout(() => Animations.init(), 500);
    
    console.log('%c SHVETS PRO ', 'background: #C9A962; color: #0D0D0D; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;', 'Website Loaded Successfully');
});
