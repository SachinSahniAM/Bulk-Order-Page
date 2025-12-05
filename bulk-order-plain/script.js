// Configuration
const API_BASE_URL = 'https://bulk-order-revamp.preview.emergentagent.com/api';

// State
let state = {
    productType: 'round-neck-tshirt',
    quantity: 50,
    printingType: 'screen',
    quote: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    calculateQuote();
});

// Product Selection
function selectProduct(productType) {
    state.productType = productType;
    
    // Update UI
    const buttons = document.querySelectorAll('.product-btn');
    buttons.forEach(btn => {
        if (btn.dataset.product === productType) {
            btn.className = 'product-btn py-4 px-4 rounded-xl font-bold transition-all text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105';
        } else {
            btn.className = 'product-btn py-4 px-4 rounded-xl font-bold transition-all text-center bg-gray-100 text-gray-700 hover:bg-gray-200';
        }
    });
    
    calculateQuote();
}

// Update Quantity
function updateQuantity(value) {
    state.quantity = parseInt(value);
    document.getElementById('quantity-display').textContent = value;
    calculateQuote();
}

// Calculate Quote
async function calculateQuote() {
    const printingType = document.getElementById('printing-type').value;
    state.printingType = printingType;
    
    try {
        const response = await fetch(`${API_BASE_URL}/calculate-quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_type: state.productType,
                quantity: state.quantity,
                printing_type: state.printingType
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to calculate quote');
        }
        
        const data = await response.json();
        state.quote = data;
        
        // Update UI
        document.getElementById('price-range').textContent = data.estimated_price_range;
        document.getElementById('per-piece-price').textContent = data.per_piece_price;
        document.getElementById('discount-percentage').textContent = data.discount_percentage + '%';
        document.getElementById('delivery-time').textContent = data.delivery_time;
        
    } catch (error) {
        console.error('Error calculating quote:', error);
        document.getElementById('price-range').textContent = 'Error calculating';
    }
}

// Send to WhatsApp
function sendToWhatsApp() {
    const productName = state.productType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const printingName = state.printingType.charAt(0).toUpperCase() + state.printingType.slice(1);
    const priceRange = state.quote ? state.quote.estimated_price_range : 'calculating...';
    
    const message = `Hi! I need a quote for:
- Product: ${productName}
- Quantity: ${state.quantity} pieces
- Printing: ${printingName}
- Estimated: ${priceRange}

Please send me exact pricing and mockup!`;
    
    const url = `https://wa.me/917619168045?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Scroll to Form
function scrollToForm() {
    document.getElementById('quick-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Submit Form
async function submitForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    const formData = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        phone: document.getElementById('form-phone').value,
        quantity: parseInt(document.getElementById('form-quantity').value),
        product_type: document.getElementById('form-product').value,
        printing_type: state.printingType,
        message: '',
        estimated_price: state.quote ? state.quote.estimated_price_range : null
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/bulk-order-lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        
        // Show success message
        document.getElementById('lead-form').classList.add('hidden');
        document.getElementById('success-message').classList.remove('hidden');
        
        // Reinitialize icons for success message
        lucide.createIcons();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try WhatsApp or call us directly!');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Free Mockup Now →';
    }
}

// Reset Form
function resetForm() {
    document.getElementById('lead-form').classList.remove('hidden');
    document.getElementById('success-message').classList.add('hidden');
    document.getElementById('lead-form').reset();
    
    // Scroll to form
    scrollToForm();
}

// Initialize FAQ
function initializeFAQ() {
    const faqs = [
        { 
            q: "Minimum order?", 
            a: "10 pieces. Discounts start from 50 pieces (15% OFF)." 
        },
        { 
            q: "Delivery time?", 
            a: "7-10 days for most orders. Faster for urgent needs." 
        },
        { 
            q: "Can I see a sample?", 
            a: "Yes! We send free mockups before production." 
        },
        { 
            q: "All India delivery?", 
            a: "Yes, free shipping pan-India." 
        },
        { 
            q: "Payment terms?", 
            a: "50% advance, 50% before delivery. Flexible for bulk orders." 
        }
    ];
    
    const container = document.getElementById('faq-container');
    
    faqs.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'border-2 border-gray-200 rounded-xl overflow-hidden';
        faqItem.innerHTML = `
            <button onclick="toggleFAQ(${index})" 
                    class="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 font-bold text-lg">
                ${faq.q}
                <span class="text-2xl faq-icon" id="faq-icon-${index}">+</span>
            </button>
            <div id="faq-answer-${index}" class="hidden px-6 py-4 bg-gray-50 text-gray-700">
                ${faq.a}
            </div>
        `;
        container.appendChild(faqItem);
    });
}

// Toggle FAQ
function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.textContent = '−';
    } else {
        answer.classList.add('hidden');
        icon.textContent = '+';
    }
}

// Product name mapping for display
function getProductDisplayName(productType) {
    const names = {
        'round-neck-tshirt': 'Round Neck T-Shirt',
        'collar-tshirt': 'Collar T-Shirt',
        'hoodie': 'Hoodie',
        'zipper-hoodie': 'Zipper Hoodie',
        'sweatshirt': 'Sweatshirt'
    };
    return names[productType] || productType;
}

// Price mapping
function getProductBasePrice(productType) {
    const prices = {
        'round-neck-tshirt': 499,
        'collar-tshirt': 599,
        'hoodie': 799,
        'zipper-hoodie': 899,
        'sweatshirt': 699
    };
    return prices[productType] || 499;
}
