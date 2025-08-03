// --- User Storage ---
export function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

export function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// --- Current User Session ---
export function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}

// --- Cart Storage ---
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// --- Orders Storage ---
export function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

// --- Products Storage ---
export function saveProducts(products) {
  localStorage.setItem('productsList', JSON.stringify(products));
}

export function getProducts() {
  return JSON.parse(localStorage.getItem('productsList')) || [];
}
