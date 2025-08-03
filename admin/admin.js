document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // Protect page: only allow admins
  if (!user || !user.isAdmin) {
    alert("Access denied. Admins only.");
    window.location.href = "../auth/auth.html";
    return;
  }

  document.getElementById("welcomeMsg").innerText = `Welcome, ${user.username}!`;

  const ordersContainer = document.getElementById("ordersContainer");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  function renderOrders() {
    ordersContainer.innerHTML = "";
    orders.forEach(order => {
      const item = order.items[0] || {};
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${item.image || ''}" class="card-img-top" alt="${item.title || ''}" />
          <div class="card-body">
            <h5 class="card-title">${item.title || 'Product'}</h5>
            <p class="card-text">Quantity: ${item.quantity}</p>
            <p class="card-text">Price: $${item.price}</p>
            <p class="card-text"><small class="text-muted">Date: ${order.date?.split("T")[0]}</small></p>
          </div>
        </div>
      `;
      ordersContainer.appendChild(col);
    });
  }

  renderOrders();

  placeOrderBtn.addEventListener("click", async () => {
    const res = await fetch("https://fakestoreapi.com/products?limit=1");
    const data = await res.json();
    const product = data[0];

    const testOrder = {
      id: "TEST-" + Date.now(),
      items: [{
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        image: product.image
      }],
      date: new Date().toISOString()
    };

    orders.unshift(testOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
    updateAdminDashboard();
    alert("Test order added.");
  });

  // === Product Management ===
  let adminProducts = JSON.parse(localStorage.getItem("productsList")) || [];

  if (adminProducts.length === 0) {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    adminProducts = data.map(p => ({
      id: p.id || crypto.randomUUID(),
      title: p.title,
      price: p.price,
      category: p.category,
      image: p.image
    }));
    localStorage.setItem("productsList", JSON.stringify(adminProducts));
  }

  function displayAdminProducts() {
    const container = document.getElementById("adminProductList");
    container.innerHTML = "";

    adminProducts.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card h-100 p-3">
          <h5>${product.title}</h5>
          <img src="${product.image}" style="height:150px;object-fit:contain" />
          <p>Price: $${product.price}</p>
          <p>Category: ${product.category}</p>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-warning btn-sm w-50" onclick="editProduct('${product.id}')">Edit</button>
            <button class="btn btn-danger btn-sm w-50" onclick="deleteProduct('${product.id}')">Delete</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  window.editProduct = function (id) {
    const p = adminProducts.find(p => p.id == id);
    if (p) {
      document.getElementById("productTitle").value = p.title;
      document.getElementById("productPrice").value = p.price;
      document.getElementById("productCategory").value = p.category;
      document.getElementById("productImage").value = p.image;
      deleteProduct(id); // remove existing so we re-add as "edited"
    }
  };

  window.deleteProduct = function (id) {
    adminProducts = adminProducts.filter(p => p.id != id);
    localStorage.setItem("productsList", JSON.stringify(adminProducts));
    displayAdminProducts();
    updateAdminDashboard();
  };

  document.getElementById("addProductForm").addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("productTitle").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value;
    const image = document.getElementById("productImage").value;

    const newProduct = {
      id: crypto.randomUUID(),
      title,
      price,
      category,
      image
    };

    adminProducts.unshift(newProduct);
    localStorage.setItem("productsList", JSON.stringify(adminProducts));
    displayAdminProducts();
    e.target.reset();
    updateAdminDashboard();
  });

  function updateAdminDashboard() {
    document.getElementById("adminDashboard").classList.remove("d-none");
    document.getElementById("productManagement").classList.remove("d-none");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    document.getElementById("totalUsers").innerText = users.length;
    document.getElementById("totalProducts").innerText = adminProducts.length;
    document.getElementById("totalOrders").innerText = orders.length;

    const totalSales = orders.reduce((sum, order) => {
      return sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0);
    }, 0);
    document.getElementById("totalSales").innerText = `$${totalSales.toFixed(2)}`;
  }

  displayAdminProducts();
  updateAdminDashboard();
});
