/**
 * ============================================================================
 * SHVETS PRO - Premium Price Calculator
 * Version 4.0 - Compatible with new HTML structure
 * ============================================================================
 */

'use strict';

const Calculator = (() => {
    // ========================================
    // PRICING CONFIGURATION
    // ========================================
    
    // Base prices (psychological pricing - not round numbers)
    const prices = {
        standard: { base: 139, bedroom: 35, bathroom: 30 },
        deep:     { base: 219, bedroom: 45, bathroom: 40 },
        move:     { base: 289, bedroom: 55, bathroom: 50 },
        airbnb:   { base: 119, bedroom: 30, bathroom: 25 }
    };
    
    // Frequency discounts
    const discounts = {
        once: 0,
        monthly: 0.10,
        biweekly: 0.15,
        weekly: 0.20
    };
    
    // Add-on prices
    const addons = {
        fridge: 35,
        oven: 35,
        windows: 50,
        laundry: 25
    };
    
    // ========================================
    // STATE
    // ========================================
    
    let state = {
        service: 'standard',
        bedrooms: 3,
        bathrooms: 2,
        frequency: 'monthly',
        extras: []
    };
    
    // ========================================
    // DOM ELEMENTS
    // ========================================
    
    const elements = {};
    
    const cacheElements = () => {
        elements.serviceOptions = document.querySelectorAll('#serviceOptions .calc-option');
        elements.frequencyOptions = document.querySelectorAll('#frequencyOptions .calc-option');
        elements.bedrooms = document.getElementById('bedrooms');
        elements.bathrooms = document.getElementById('bathrooms');
        elements.addonCheckboxes = document.querySelectorAll('#addonOptions input[type="checkbox"]');
        elements.totalPrice = document.getElementById('totalPrice');
        elements.savingsAmount = document.getElementById('savingsAmount');
        elements.discountInfo = document.getElementById('discountInfo');
        elements.bookNowBtn = document.getElementById('bookNowBtn');
    };
    
    // ========================================
    // CALCULATION
    // ========================================
    
    const calculate = () => {
        const pricing = prices[state.service] || prices.standard;
        
        // Base calculation
        let subtotal = pricing.base;
        subtotal += (state.bedrooms - 1) * pricing.bedroom;
        subtotal += (state.bathrooms - 1) * pricing.bathroom;
        
        // Add extras
        state.extras.forEach(addon => {
            subtotal += addons[addon] || 0;
        });
        
        // Calculate discount
        const discountPercent = discounts[state.frequency] || 0;
        const savings = Math.round(subtotal * discountPercent);
        const total = subtotal - savings;
        
        return { subtotal, savings, total, discountPercent };
    };
    
    const updateDisplay = () => {
        const result = calculate();
        
        // Update price
        if (elements.totalPrice) {
            elements.totalPrice.textContent = `$${result.total}`;
        }
        
        // Update savings
        if (elements.savingsAmount) {
            elements.savingsAmount.textContent = `$${result.savings}`;
        }
        
        // Show/hide discount info
        if (elements.discountInfo) {
            elements.discountInfo.style.display = result.savings > 0 ? 'flex' : 'none';
        }
    };
    
    // ========================================
    // EVENT HANDLERS
    // ========================================
    
    const handleServiceClick = (e) => {
        const btn = e.currentTarget;
        
        // Update UI
        elements.serviceOptions.forEach(opt => opt.classList.remove('active'));
        btn.classList.add('active');
        
        // Update state
        state.service = btn.dataset.value;
        
        // Animate
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
        
        updateDisplay();
    };
    
    const handleFrequencyClick = (e) => {
        const btn = e.currentTarget;
        
        // Update UI
        elements.frequencyOptions.forEach(opt => opt.classList.remove('active'));
        btn.classList.add('active');
        
        // Update state
        state.frequency = btn.dataset.value;
        
        // Animate
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
        
        updateDisplay();
    };
    
    const handleBedroomChange = () => {
        state.bedrooms = parseInt(elements.bedrooms.value) || 3;
        updateDisplay();
    };
    
    const handleBathroomChange = () => {
        state.bathrooms = parseInt(elements.bathrooms.value) || 2;
        updateDisplay();
    };
    
    const handleAddonChange = (e) => {
        const checkbox = e.target;
        const addon = checkbox.dataset.addon;
        
        if (checkbox.checked) {
            if (!state.extras.includes(addon)) {
                state.extras.push(addon);
            }
        } else {
            state.extras = state.extras.filter(a => a !== addon);
        }
        
        updateDisplay();
    };
    
    // ========================================
    // BOOKING
    // ========================================
    
    const getBookingSummary = () => {
        const result = calculate();
        const serviceNames = {
            standard: 'Standard Cleaning',
            deep: 'Deep Cleaning',
            move: 'Move In/Out',
            airbnb: 'Airbnb Turnover'
        };
        const frequencyNames = {
            once: 'One-Time',
            monthly: 'Monthly',
            biweekly: 'Bi-Weekly',
            weekly: 'Weekly'
        };
        
        return {
            service: serviceNames[state.service],
            bedrooms: state.bedrooms,
            bathrooms: state.bathrooms,
            frequency: frequencyNames[state.frequency],
            extras: state.extras,
            price: result.total,
            savings: result.savings
        };
    };
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    const bindEvents = () => {
        // Service options
        elements.serviceOptions.forEach(btn => {
            btn.addEventListener('click', handleServiceClick);
        });
        
        // Frequency options
        elements.frequencyOptions.forEach(btn => {
            btn.addEventListener('click', handleFrequencyClick);
        });
        
        // Selects
        if (elements.bedrooms) {
            elements.bedrooms.addEventListener('change', handleBedroomChange);
        }
        if (elements.bathrooms) {
            elements.bathrooms.addEventListener('change', handleBathroomChange);
        }
        
        // Addons
        elements.addonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleAddonChange);
        });
    };
    
    const init = () => {
        cacheElements();
        
        // Check if calculator exists on page
        if (!elements.totalPrice) {
            console.log('Calculator not found on page');
            return;
        }
        
        bindEvents();
        
        // Set initial state from DOM
        const activeService = document.querySelector('#serviceOptions .calc-option.active');
        if (activeService) state.service = activeService.dataset.value;
        
        const activeFrequency = document.querySelector('#frequencyOptions .calc-option.active');
        if (activeFrequency) state.frequency = activeFrequency.dataset.value;
        
        if (elements.bedrooms) state.bedrooms = parseInt(elements.bedrooms.value) || 3;
        if (elements.bathrooms) state.bathrooms = parseInt(elements.bathrooms.value) || 2;
        
        // Initial calculation
        updateDisplay();
        
        console.log('Calculator initialized');
    };
    
    // Public API
    return {
        init,
        getBookingSummary,
        calculate
    };
})();

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Calculator.init();
});

// Export for global access
window.Calculator = Calculator;
