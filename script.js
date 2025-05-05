// Sample product data


// Upsell products
const upsellProducts = [
    {
        id: 'up1',
        name: 'Bolso de canya Fletxa',
        price: 25.00,
        image: 'Bolso de canya Fletxa.png'
    },
    {
        id: 'up2',
        name: 'Pack 2 cinturons de pell reciclada',
        price: 11.00,
        image: 'Pack 2 cinturons de pell reciclada.png'
    }
];

// Cart functionality
let cart = [];

// Size selection functionality
let selectedProduct = null;
let selectedSize = null;
let selectedProductImage = null;

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartModalClose = cartModal.querySelector('.close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const confirmationToast = document.getElementById('confirmation-toast');
const upsellSection = document.getElementById('upsell-section');
const sizeModal = document.getElementById('size-modal');
const sizeButtons = document.querySelectorAll('.size-btn');
const confirmSizeBtn = document.getElementById('confirm-size');
const sizeModalClose = sizeModal.querySelector('.close');
const sizeModalImage = document.getElementById('size-modal-image');
const checkoutConfirmModal = document.getElementById('checkout-confirm-modal');
const checkoutConfirmClose = checkoutConfirmModal.querySelector('.close');
const sizeGuideModal = document.getElementById('size-guide-modal');
const sizeGuideClose = sizeGuideModal.querySelector('.close');
const sizeGuideLink = document.querySelector('.size-guide-link');
const backToCartBtn = document.getElementById('back-to-cart');

// Add event listeners to all add-to-cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = button.closest('.product-card');
        selectedProduct = button.dataset.id;
        selectedProductImage = card.querySelector('img').getAttribute('src');
        if (selectedProductImage) {
            sizeModalImage.src = selectedProductImage;
            sizeModalImage.style.display = 'block';
        } else {
            sizeModalImage.style.display = 'none';
        }
        sizeModal.style.display = 'block';
        confirmSizeBtn.disabled = true;
    });
});

// Event Listeners for size selection
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedSize = button.dataset.size;
        confirmSizeBtn.disabled = false;
    });
});

sizeModalClose.addEventListener('click', () => {
    sizeModal.style.display = 'none';
    selectedProduct = null;
    selectedSize = null;
    selectedProductImage = null;
    sizeModalImage.src = '';
    sizeModalImage.style.display = 'none';
    sizeButtons.forEach(btn => btn.classList.remove('selected'));
    confirmSizeBtn.disabled = true;
});

cartModalClose.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutConfirmClose.addEventListener('click', () => {
    checkoutConfirmModal.style.display = 'none';
});

sizeGuideLink.addEventListener('click', (e) => {
    e.preventDefault();
    sizeGuideModal.style.display = 'block';
});

sizeGuideClose.addEventListener('click', () => {
    sizeGuideModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === sizeModal) {
        sizeModal.style.display = 'none';
        selectedProduct = null;
        selectedSize = null;
        selectedProductImage = null;
        sizeModalImage.src = '';
        sizeModalImage.style.display = 'none';
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        confirmSizeBtn.disabled = true;
    }
    if (e.target === checkoutConfirmModal) {
        checkoutConfirmModal.style.display = 'none';
    }
    if (e.target === sizeGuideModal) {
        sizeGuideModal.style.display = 'none';
    }
});

confirmSizeBtn.addEventListener('click', () => {
    if (selectedProduct && selectedSize) {
        addToCart(selectedProduct, selectedSize, selectedProductImage);
        sizeModal.style.display = 'none';
        selectedProduct = null;
        selectedSize = null;
        selectedProductImage = null;
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        confirmSizeBtn.disabled = true;
    }
});

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    showUpsellItems && showUpsellItems();
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        cart = [];
        updateCart();
        cartModal.style.display = 'none';
        checkoutConfirmModal.style.display = 'block';
    }
});

backToCartBtn.addEventListener('click', () => {
    checkoutConfirmModal.style.display = 'none';
    cartModal.style.display = 'block';
});

// Functions
function showToast() {
    confirmationToast.classList.add('show');
    setTimeout(() => {
        confirmationToast.classList.remove('show');
    }, 2000);
}

function showUpsellItems() {
    if (cart.length > 0) {
        upsellSection.innerHTML = `
            <h3 class="upsell-title">També et podria interessar...</h3>
            <div class="upsell-items">
                ${upsellProducts.map(product => `
                    <div class="upsell-item" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="upsell-item-name">${product.name}</div>
                        <div class="upsell-item-price">€${product.price.toFixed(2)}</div>
                        <button class="upsell-add-btn" data-id="${product.id}">Afegir a la cistella</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners to upsell buttons
        document.querySelectorAll('.upsell-add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.getAttribute('data-id');
                const item = document.querySelector(`.upsell-item[data-id="${id}"]`);
                const image = item.getAttribute('data-image');
                addToCart(id, 'Sense talla', image);
            });
        });
    } else {
        upsellSection.innerHTML = '';
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">€${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="showSizeModal('${product.id}')">Afegir a la Cistella</button>
        </div>
    `;
    return card;
}

function displayProducts() {
    // Display new products
    const newProductsGrid = document.querySelector('#new .product-grid');
    products.new.forEach(product => {
        newProductsGrid.appendChild(createProductCard(product));
    });

    // Display unique products
    const uniqueProductsGrid = document.querySelector('#unique .product-grid');
    products.unique.forEach(product => {
        uniqueProductsGrid.appendChild(createProductCard(product));
    });

    // Display secondhand products
    const secondhandProductsGrid = document.querySelector('#secondhand .product-grid');
    products.secondhand.forEach(product => {
        secondhandProductsGrid.appendChild(createProductCard(product));
    });
}

function showSizeModal(productId) {
    selectedProduct = productId;
    sizeModal.style.display = 'block';
    confirmSizeBtn.disabled = true;
}

function addToCart(productId, size, image) {
    // Get product info from the button or upsell data
    const button = document.querySelector(`.add-to-cart[data-id='${productId}']`);
    let name, price, category;
    
    // Check if it's an upsell product (button won't exist)
    if (!button) {
        // Find the product in upsellProducts array
        const upsellProduct = upsellProducts.find(p => p.id === productId);
        if (upsellProduct) {
            name = upsellProduct.name;
            price = upsellProduct.price;
            category = 'upsell';
        } else {
            console.error('Product not found:', productId);
            return;
        }
    } else {
        // Regular product, get data from button
        name = button.dataset.name;
        price = parseFloat(button.dataset.price);
        category = button.dataset.category;
    }
    
    // Check if already in cart (same id and size)
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name,
            price,
            category,
            image,
            size,
            quantity: 1
        });
    }
    updateCart();
    showToast();
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCart();
    showUpsellItems && showUpsellItems();
}

function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    // Update cart items display
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display:flex;align-items:center;gap:1rem;">
                <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
                <div style="text-align:left;">
                    <h4>${item.name}</h4>
                    <p>Talla: ${item.size}</p>
                    <p>€${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <div>
                <p>€${itemTotal.toFixed(2)}</p>
                <button onclick="removeFromCart('${item.id}', '${item.size}')" style="color: red; border: none; background: none; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    // Update total amount
    totalAmount.textContent = total.toFixed(2);
    
    // Update upsell section if cart modal is visible
    if (cartModal.style.display === 'block') {
        showUpsellItems();
    }
}

// Initialize the store
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
});

// Make addToCart globally available for upsell buttons
window.addToCart = addToCart; 