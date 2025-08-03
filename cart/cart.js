// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cartItemsContainer = document.getElementById('cartItems');
  const subtotalElement = document.getElementById('subtotal');
  const totalElement = document.getElementById('total');
  const orderForm = document.getElementById('orderForm');
  const promoCodeInput = document.getElementById('promoCode');
  const applyPromoButton = document.getElementById('applyPromo');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const orderIdElement = document.getElementById('orderId');
  const confirmationEmailElement = document.getElementById('confirmationEmail');
  const orderTotalElement = document.getElementById('orderTotal');
  const deliveryAddressElement = document.getElementById('deliveryAddress');

  //promo codes
  const promoCodes = {
    'WELCOME10': 0.1,  // 10% off
    'SUMMER20': 0.2,   // 20% off
    'FREESHIP': 0.05   // 5% off
  };

  let appliedPromo = null;
  let cart = getCart();

  // Initialize
  renderCart();
  updateCartSummary();

  // Event Listeners
  applyPromoButton.addEventListener('click', applyPromoCode);
  orderForm.addEventListener('submit', placeOrder);

  // Functions
  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  function saveCart(cartData) {
    localStorage.setItem('cart', JSON.stringify(cartData));
    cart = cartData;
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="alert alert-info">
          Your cart is empty. <a href="../products/products.html" class="alert-link">Continue shopping</a>
        </div>
      `;
      return;
    }

    let cartHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    cart.forEach(item => {
      cartHTML += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;" class="me-3">
              <span>${item.title}</span>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="input-group" style="width: 120px;">
              <button class="btn btn-sm btn-outline-secondary" onclick="decreaseQuantity(${item.id})">-</button>
              <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
              <button class="btn btn-sm btn-outline-secondary" onclick="increaseQuantity(${item.id})">+</button>
            </div>
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
              <i class="bi bi-trash"></i> Remove
            </button>
          </td>
        </tr>
      `;
    });

    cartHTML += `
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-danger me-2" onclick="clearCart()">Clear Cart</button>
        <a href="../products/products.html" class="btn btn-outline-primary">Continue Shopping</a>
      </div>
    `;

    cartItemsContainer.innerHTML = cartHTML;

    // Add global functions for the buttons
    window.increaseQuantity = increaseQuantity;
    window.decreaseQuantity = decreaseQuantity;
    window.removeFromCart = removeFromCart;
    window.clearCart = clearCart;
  }

  function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 5 : 0;
    let discount = 0;

    if (appliedPromo) {
      discount = subtotal * promoCodes[appliedPromo];
    }

    const total = subtotal + shipping - discount;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  function increaseQuantity(productId) {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    saveCart(updatedCart);
    renderCart();
    updateCartSummary();
  }

  function decreaseQuantity(productId) {
    const updatedCart = cart.map(item => {
      if (item.id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    saveCart(updatedCart);
    renderCart();
    updateCartSummary();
  }

  function removeFromCart(productId) {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    renderCart();
    updateCartSummary();
  }

  function clearCart() {
  saveCart([]);
  renderCart();
  updateCartSummary();
  }


  function applyPromoCode() {
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (!code) {
      alert('Please enter a promo code');
      return;
    }

    if (promoCodes[code]) {
      appliedPromo = code;
      updateCartSummary();
      alert(`Promo code ${code} applied successfully!`);
    } else {
      alert('Invalid promo code');
    }
  }

  function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function placeOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment').value;

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 5;
    let discount = 0;

    if (appliedPromo) {
      discount = subtotal * promoCodes[appliedPromo];
    }

    const total = subtotal + shipping - discount;

    // Create order object
    const orderId = generateOrderId();
    const order = {
      id: orderId,
      customer: { name, email, address },
      items: cart,
      payment: paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
      promoApplied: appliedPromo,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    // Save order to localStorage
    saveOrder(order);

    // Clear cart
    clearCart();

    // Show confirmation
    showOrderConfirmation(order);

    // Simulate email sending
    simulateSendEmail(order);
  }

  function saveOrder(order) {
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add new order
    orders.unshift(order);
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  function showOrderConfirmation(order) {
      // Optional: Disable form fields instead of hiding
     orderForm.querySelectorAll('input, textarea, select, button').forEach(el => el.disabled = true);

      // Show confirmation section
    orderConfirmation.classList.remove('d-none');

      // Set confirmation details
    orderIdElement.textContent = order.id;
    orderTotalElement.textContent = `$${order.total.toFixed(2)}`;
    confirmationEmailElement.textContent = order.customer.email;
    deliveryAddressElement.textContent = order.customer.address;
  }


  function simulateSendEmail(order) {
    console.log('Sending confirmation email to:', order.customer.email);
    console.log('Order details:', order);
    // In a real application, this would call an API to send an email
  }
});

// Add to cart function - to be called from products page
function addToCart(product) {
  // Get current cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex > -1) {
    // Increase quantity if product already in cart
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new product to cart
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  // Save updated cart
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show notification
  alert(`${product.title} added to cart!`);
}