// script.js

/* =====================================
   WHOLEMART - PROFESSIONAL B2B LOGIC
   Inspired by Jumbotail-style workflow
===================================== */

/* ========= STATE MANAGEMENT ========= */

const state = {
  user: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  orders: JSON.parse(localStorage.getItem("orders")) || [],
  products: [],
  filteredProducts: []
};

/* ========= PRODUCT DATABASE (DEMO) ========= */

state.products = [
  {
    id: 1,
    name: "Premium Basmati Rice 25kg",
    category: "Grains",
    price: 1800,
    stock: 50,
    image: " https://cdn.pixabay.com/photo/2025/05/13/09/23/basmati-9597042_1280.png",
    minOrderQty: 1
  },
  {
    id: 2,
    name: "Toor Dal 10kg",
    category: "Pulses",
    price: 950,
    stock: 40,
    image:" https://tse3.mm.bing.net/th/id/OIP.y39bUdA3uNIUXcc5jKnJQgHaD4?rs=1&pid=ImgDetMain&o=7&rm=3 ",
    minOrderQty: 1
  },
  {
    id: 3,
    name: "Sunflower Oil 5L",
    category: "Oils",
    price: 720,
    stock: 60,
    image: " https://tse3.mm.bing.net/th/id/OIP.0WgEfxasEzQIrRjCDd2Z0QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3 ",
    minOrderQty: 1
  }

];

state.filteredProducts = [...state.products];

/* ========= INITIALIZATION ========= */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCartCount();
  renderOrders();
});

/* ========= PRODUCT RENDERING ========= */

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  state.filteredProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>Category: ${product.category}</p>
      <p>₹${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      <button class="buy-btn" onclick="buyNow(${product.id})">Buy Now</button>
    `;

    productList.appendChild(div);
  });
}

/* ========= SEARCH FUNCTION ========= */

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();

  state.filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  renderProducts();
  renderSuggestions(query);
}

function renderSuggestions(query) {
  const suggestionBox = document.getElementById("suggestions");
  suggestionBox.innerHTML = "";

  if (!query) return;

  const matches = state.products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  matches.forEach(match => {
    const li = document.createElement("li");
    li.textContent = match.name;
    li.onclick = () => {
      document.getElementById("search").value = match.name;
      state.filteredProducts = [match];
      renderProducts();
      suggestionBox.innerHTML = "";
    };
    suggestionBox.appendChild(li);
  });
}

/* ========= CART SYSTEM ========= */

function addToCart(productId) {
  const product = state.products.find(p => p.id === productId);

  if (!product || product.stock <= 0) {
    alert("Product out of stock");
    return;
  }

  const existing = state.cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCartCount();
}

function buyNow(productId) {
  addToCart(productId);
  openCart();
}

function renderCartCount() {
  document.getElementById("cart-count").textContent = state.cart.length;
}

function openCart() {
  const modal = document.getElementById("cart-modal");
  modal.classList.add("active");
  renderCartItems();
}

function closeCart() {
  document.getElementById("cart-modal").classList.remove("active");
}

function renderCartItems() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (state.cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  state.cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</p>
    `;
    cartContainer.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `<strong>Total: ₹${total}</strong>`;
  cartContainer.appendChild(totalDiv);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

/* ========= CHECKOUT ========= */

function checkout() {
  if (state.cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const order = {
    id: Date.now(),
    items: [...state.cart],
    total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString(),
    status: "Confirmed"
  };

  state.orders.push(order);
  localStorage.setItem("orders", JSON.stringify(state.orders));

  state.cart = [];
  saveCart();
  renderCartCount();
  renderOrders();
  closeCart();

  alert("Order placed successfully!");
}

/* ========= ORDER HISTORY ========= */

function renderOrders() {
  const orderList = document.getElementById("order-list");

  if (!state.orders.length) {
    orderList.innerHTML = "No orders placed yet.";
    return;
  }

  orderList.innerHTML = "";

  state.orders.forEach(order => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>Order ID: ${order.id}</h4>
      <p>Date: ${order.date}</p>
      <p>Status: ${order.status}</p>
      <p>Total: ₹${order.total}</p>
      <hr/>
    `;
    orderList.appendChild(div);
  });
}

/* ========= UTILITIES ========= */

function scrollToMarketplace() {
  document.getElementById("marketplace").scrollIntoView({
    behavior: "smooth"
  });
}

function contactAlert() {
  alert("Our support team will contact you shortly.");
}