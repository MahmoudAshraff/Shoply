/* cart.js — full cart logic using localStorage */

const CART_KEY = "shoply_cart_v1";

/* Helpers */
function getCart(){
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCountUI();
}

function addToCart(id, qty = 1){
  const cart = getCart();
  const found = cart.find(i => i.id === id);

  if(found) found.qty += qty;
  else cart.push({ id, qty });

  saveCart(cart);
  toast("Added to cart");
}

function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCartItems();
}

function updateQty(id, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;

  item.qty = qty;
  saveCart(cart);
  renderCartItems();
}

function cartTotal(){
  const cart = getCart();
  let total = 0;

  cart.forEach(i => {
    const p = SHOPLY.PRODUCTS.find(x => x.id === i.id);
    if(p) total += p.price * i.qty;
  });

  return total;
}

function updateCartCountUI(){
  const count = getCart().reduce((n, i) => n + i.qty, 0);
  document.querySelectorAll('.cart-count')
    .forEach(el => el.textContent = count);
}

/* Cart Page Rendering */
function renderCartItems(){
  const el = document.getElementById('cartItems');
  if(!el) return;

  const cart = getCart();

  if(cart.length === 0){
    el.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById('cartTotal').textContent = "$0.00";
    return;
  }

  el.innerHTML = cart.map(i => {
    const p = SHOPLY.PRODUCTS.find(x => x.id === i.id);
    return `
      <div class="cart-row">
        <img src="${p.image}" alt="${p.title}">
        <div style="flex:1">
          <h4>${p.title}</h4>
          <p class="price">${formatPrice(p.price)}</p>
        </div>

        <input type="number" class="cart-qty" data-id="${i.id}" min="1" value="${i.qty}">
        <button class="btn remove-js" data-id="${i.id}">Remove</button>
      </div>
    `;
  }).join('');

  document.getElementById('cartTotal').textContent = formatPrice(cartTotal());

  // Events
  document.querySelectorAll('.remove-js').forEach(btn =>
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)))
  );

  document.querySelectorAll('.cart-qty').forEach(inp =>
    inp.addEventListener('change', () => {
      const id = Number(inp.dataset.id);
      const val = Number(inp.value);
      if(val < 1){ inp.value = 1; return; }
      updateQty(id, val);
    })
  );
}

function formatPrice(n){
  return `$${n.toFixed(2)}`;
}

/* Small Toast */
function toast(msg){
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.right = "1rem";
  t.style.bottom = "1rem";
  t.style.background = "#111";
  t.style.color = "#fff";
  t.style.padding = "0.6rem 1rem";
  t.style.borderRadius = "8px";
  t.style.zIndex = 999;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

/* Cart Page Load */
window.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
});
