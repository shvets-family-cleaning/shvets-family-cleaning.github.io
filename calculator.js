// ========================================
// SHVETS PRO - Premium Price Calculator
// Ultra-Premium Pricing for North Atlanta
// ========================================

// Premium Base Prices - North Atlanta Market (Higher-end)
const basePrices = {
    standard: { 
        base: 199,      // Base price for standard cleaning
        bedroom: 35,    // Per bedroom
        bathroom: 30    // Per bathroom
    },
    deep: { 
        base: 299,      // Deep cleaning base
        bedroom: 50,    // Per bedroom  
        bathroom: 45    // Per bathroom
    },
    moveout: { 
        base: 399,      // Move in/out base
        bedroom: 60,    // Per bedroom
        bathroom: 55    // Per bathroom
    },
    airbnb: { 
        base: 149,      // Airbnb turnover base (fast & efficient)
        bedroom: 30,    // Per bedroom
        bathroom: 25    // Per bathroom
    }
};

// Square footage multipliers - Premium scaling
const sqftMultipliers = {
    1500: 1.0,      // Under 1,500 sq ft - base price
    2000: 1.12,     // 1,500 - 2,000 sq ft
    2500: 1.25,     // 2,000 - 2,500 sq ft
    3000: 1.4,      // 2,500 - 3,000 sq ft
    3500: 1.55,     // 3,000 - 3,500 sq ft
    4000: 1.75,     // 3,500 - 4,000 sq ft
    5000: 2.0       // 4,000+ sq ft
};

// Service names for display - All languages
const serviceNames = {
    en: {
        standard: 'Standard Cleaning',
        deep: 'Deep Cleaning',
        moveout: 'Move In/Out Cleaning',
        airbnb: 'Airbnb Turnover'
    },
    ru: {
        standard: 'Стандартная уборка',
        deep: 'Генеральная уборка',
        moveout: 'Уборка при переезде',
        airbnb: 'Airbnb уборка'
    },
    uk: {
        standard: 'Стандартне прибирання',
        deep: 'Генеральне прибирання',
        moveout: 'Прибирання при переїзді',
        airbnb: 'Airbnb прибирання'
    },
    es: {
        standard: 'Limpieza Estándar',
        deep: 'Limpieza Profunda',
        moveout: 'Limpieza de Mudanza',
        airbnb: 'Rotación Airbnb'
    }
};

// Calculate price
function calculatePrice() {
    // Get selected service
    const serviceInput = document.querySelector('input[name="service"]:checked');
    const service = serviceInput ? serviceInput.value : 'standard';
    
    // Get bedroom and bathroom counts
    const bedroomsInput = document.getElementById('bedrooms');
    const bathroomsInput = document.getElementById('bathrooms');
    const bedrooms = bedroomsInput ? parseInt(bedroomsInput.value) || 3 : 3;
    const bathrooms = bathroomsInput ? parseInt(bathroomsInput.value) || 2 : 2;
    
    // Get square footage
    const sqftSelect = document.getElementById('sqft');
    const sqft = sqftSelect ? parseInt(sqftSelect.value) || 2000 : 2000;
    
    // Get extras
    let extrasTotal = 0;
    const extraInputs = document.querySelectorAll('input[name="extras"]:checked');
    extraInputs.forEach(input => {
        extrasTotal += parseInt(input.getAttribute('data-price')) || 0;
    });
    
    // Calculate base price
    const pricing = basePrices[service];
    let price = pricing.base;
    price += bedrooms * pricing.bedroom;
    price += bathrooms * pricing.bathroom;
    
    // Apply square footage multiplier
    const multiplier = sqftMultipliers[sqft] || 1;
    price *= multiplier;
    
    // Add extras
    price += extrasTotal;
    
    // Round to nearest $5
    price = Math.round(price / 5) * 5;
    
    // Update display
    const priceDisplay = document.getElementById('estimatedPrice');
    if (priceDisplay) {
        animatePrice(priceDisplay, price);
    }
    
    return {
        service,
        bedrooms,
        bathrooms,
        sqft,
        extras: extrasTotal,
        price
    };
}

// Animate price counter with smooth effect
function animatePrice(element, targetPrice) {
    const currentPrice = parseInt(element.textContent) || 0;
    const difference = targetPrice - currentPrice;
    
    if (difference === 0) return;
    
    const duration = 400; // ms
    const steps = 25;
    const stepValue = difference / steps;
    const stepDuration = duration / steps;
    
    let step = 0;
    
    // Add pulse effect
    element.style.transform = 'scale(1.05)';
    element.style.color = '#C9A962';
    
    const interval = setInterval(() => {
        step++;
        const newPrice = Math.round(currentPrice + (stepValue * step));
        element.textContent = newPrice;
        
        if (step >= steps) {
            clearInterval(interval);
            element.textContent = targetPrice;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }
    }, stepDuration);
}

// Number input controls
function setupNumberInputs() {
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            
            let value = parseInt(input.value) || 1;
            
            if (this.classList.contains('plus')) {
                value = Math.min(value + 1, 10);
            } else if (this.classList.contains('minus')) {
                value = Math.max(value - 1, 1);
            }
            
            input.value = value;
            
            // Add haptic feedback animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            calculatePrice();
        });
    });
}

// Setup calculator event listeners
function setupCalculator() {
    // Service type selection
    document.querySelectorAll('input[name="service"]').forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
    
    // Square footage selection
    const sqftSelect = document.getElementById('sqft');
    if (sqftSelect) {
        sqftSelect.addEventListener('change', calculatePrice);
    }
    
    // Extras checkboxes
    document.querySelectorAll('input[name="extras"]').forEach(input => {
        input.addEventListener('change', function() {
            // Add visual feedback
            const content = this.nextElementSibling;
            if (content) {
                content.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    content.style.transform = 'scale(1)';
                }, 100);
            }
            calculatePrice();
        });
    });
    
    // Number inputs
    setupNumberInputs();
    
    // Initial calculation
    calculatePrice();
}

// Get booking summary
function getBookingSummary() {
    const data = calculatePrice();
    const lang = localStorage.getItem('shvets-lang') || 'en';
    const names = serviceNames[lang] || serviceNames.en;
    
    let bedroomText, bathroomText;
    
    switch(lang) {
        case 'ru':
            bedroomText = 'спален';
            bathroomText = 'ванных';
            break;
        case 'uk':
            bedroomText = 'спалень';
            bathroomText = 'ванних';
            break;
        case 'es':
            bedroomText = 'habitaciones';
            bathroomText = 'baños';
            break;
        default:
            bedroomText = 'Bedrooms';
            bathroomText = 'Bathrooms';
    }
    
    return {
        serviceName: names[data.service],
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        bedroomText,
        bathroomText,
        price: data.price,
        data
    };
}

// Format booking message for WhatsApp
function formatBookingMessage(formData, bookingData) {
    const lang = localStorage.getItem('shvets-lang') || 'en';
    
    let message;
    
    switch(lang) {
        case 'ru':
            message = `✨ НОВАЯ ЗАЯВКА НА УБОРКУ

📋 Услуга: ${bookingData.serviceName}
🛏️ Спален: ${bookingData.bedrooms}
🚿 Ванных: ${bookingData.bathrooms}
💰 Примерная цена: $${bookingData.price}

👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
📧 Email: ${formData.email}
📍 Адрес: ${formData.address}
📅 Дата: ${formData.date}
⏰ Время: ${formData.time}
📝 Примечания: ${formData.notes || 'Нет'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        case 'uk':
            message = `✨ НОВА ЗАЯВКА НА ПРИБИРАННЯ

📋 Послуга: ${bookingData.serviceName}
🛏️ Спалень: ${bookingData.bedrooms}
🚿 Ванних: ${bookingData.bathrooms}
💰 Орієнтовна ціна: $${bookingData.price}

👤 Ім'я: ${formData.name}
📱 Телефон: ${formData.phone}
📧 Email: ${formData.email}
📍 Адреса: ${formData.address}
📅 Дата: ${formData.date}
⏰ Час: ${formData.time}
📝 Примітки: ${formData.notes || 'Немає'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        case 'es':
            message = `✨ NUEVA SOLICITUD DE LIMPIEZA

📋 Servicio: ${bookingData.serviceName}
🛏️ Habitaciones: ${bookingData.bedrooms}
🚿 Baños: ${bookingData.bathrooms}
💰 Precio estimado: $${bookingData.price}

👤 Nombre: ${formData.name}
📱 Teléfono: ${formData.phone}
📧 Email: ${formData.email}
📍 Dirección: ${formData.address}
📅 Fecha: ${formData.date}
⏰ Hora: ${formData.time}
📝 Notas: ${formData.notes || 'Ninguna'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        default:
            message = `✨ NEW CLEANING REQUEST

📋 Service: ${bookingData.serviceName}
🛏️ Bedrooms: ${bookingData.bedrooms}
🚿 Bathrooms: ${bookingData.bathrooms}
💰 Estimated Price: $${bookingData.price}

👤 Name: ${formData.name}
📱 Phone: ${formData.phone}
📧 Email: ${formData.email}
📍 Address: ${formData.address}
📅 Date: ${formData.date}
⏰ Time: ${formData.time}
📝 Notes: ${formData.notes || 'None'}

---
SHVETS PRO - Premium Cleaning`;
    }
    
    return encodeURIComponent(message);
}

// Format contact message for WhatsApp
function formatContactMessage(formData) {
    const lang = localStorage.getItem('shvets-lang') || 'en';
    
    let message;
    
    switch(lang) {
        case 'ru':
            message = `📬 ЗАПРОС ЦЕНЫ

👤 Имя: ${formData.name}
📱 Телефон: ${formData.phone}
📧 Email: ${formData.email}
📍 Адрес: ${formData.address}
📝 Сообщение: ${formData.message || 'Прошу связаться со мной'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        case 'uk':
            message = `📬 ЗАПИТ ЦІНИ

👤 Ім'я: ${formData.name}
📱 Телефон: ${formData.phone}
📧 Email: ${formData.email}
📍 Адреса: ${formData.address}
📝 Повідомлення: ${formData.message || 'Прошу зв\'язатися зі мною'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        case 'es':
            message = `📬 SOLICITUD DE COTIZACIÓN

👤 Nombre: ${formData.name}
📱 Teléfono: ${formData.phone}
📧 Email: ${formData.email}
📍 Dirección: ${formData.address}
📝 Mensaje: ${formData.message || 'Por favor contácteme'}

---
SHVETS PRO - Premium Cleaning`;
            break;
            
        default:
            message = `📬 QUOTE REQUEST

👤 Name: ${formData.name}
📱 Phone: ${formData.phone}
📧 Email: ${formData.email}
📍 Address: ${formData.address}
📝 Message: ${formData.message || 'Please contact me'}

---
SHVETS PRO - Premium Cleaning`;
    }
    
    return encodeURIComponent(message);
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', setupCalculator);
