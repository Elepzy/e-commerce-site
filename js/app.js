// Cart state
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');

// Initialize the store
function initStore() {
    displayProducts();
    setupEventListeners();
}

// Display products in the grid
function displayProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-gray-600 mt-2">${product.description}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-xl font-bold text-gray-800">$${product.price.toFixed(2)}</span>
                    <button 
                        onclick="addToCart(${product.id})"
                        class="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    cartButton.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    closeCheckout.addEventListener('click', toggleCheckout);
    checkoutButton.addEventListener('click', () => {
        toggleCart();
        toggleCheckout();
    });
    checkoutForm.addEventListener('submit', handleCheckout);
}

// Toggle cart visibility
function toggleCart() {
    cartModal.classList.toggle('hidden');
    if (!cartModal.classList.contains('hidden')) {
        updateCart(); // Refresh cart contents when showing
    }
}

// Toggle checkout visibility
function toggleCheckout() {
    checkoutModal.classList.toggle('hidden');
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="ml-4">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center">
                <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-1 bg-gray-200 rounded">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-1 bg-gray-200 rounded">+</button>
                <button onclick="removeFromCart(${item.id})" class="ml-4 text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Handle checkout submission
function handleCheckout(e) {
    e.preventDefault();
    
    // In a real application, you would send this data to a server
    const formData = new FormData(e.target);
    const orderData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        customer: {
            name: e.target.querySelector('input[type="text"]').value,
            email: e.target.querySelector('input[type="email"]').value,
            address: e.target.querySelector('textarea').value
        }
    };

    // Simulate order processing
    alert('Order placed successfully! Thank you for your purchase.');
    
    // Clear cart and close modals
    cart = [];
    updateCart();
    toggleCheckout();
    checkoutForm.reset();
}

// Initialize the store when the page loads
document.addEventListener('DOMContentLoaded', initStore);