/* main.js — product data, UI rendering & interactions */

const PRODUCTS = [
  {id:1,title:'Rider Helmet X',price:129,category:'helmets',image:'assets/images/product-1.jpg',desc:'Ventilated lightweight helmet.'},
  {id:2,title:'Urban Jacket',price:199,category:'jackets',image:'assets/images/product-2.jpg',desc:'Water-resistant riding jacket.'},
  {id:3,title:'Classic Gloves',price:39,category:'accessories',image:'assets/images/product-3.jpg',desc:'Comfortable leather gloves.'},
  {id:4,title:'Speed Goggles',price:59,category:'accessories',image:'assets/images/product-4.jpg',desc:'Anti-glare protective goggles.'},
  {id:5,title:'Pro Helmet Z',price:149,category:'helmets',image:'assets/images/product-5.jpg',desc:'Advanced protection helmet.'}
];

function formatPrice(n){
  return `$${n.toFixed(2)}`;
}

/* Render Featured (Home Page) */
function renderFeatured(){
  const el = document.getElementById('featuredList');
  if(!el) return;

  const featured = PRODUCTS.slice(0, 3);

  el.innerHTML = featured.map(p => `
    <article class="card product-card reveal">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">${formatPrice(p.price)}</p>
      <a class="btn" href="product.html?id=${p.id}">View</a>
    </article>
  `).join('');
}

/* Products Page Listing */
function renderProductList(){
  const list = document.getElementById('productList');
  if(!list) return;

  const search = document.getElementById('searchInput');
  const cat = document.getElementById('categoryFilter');

  function filterAndRender(){
    const q = search?.value?.toLowerCase() || "";
    const c = cat?.value || "all";

    const items = PRODUCTS.filter(p =>
      (c === "all" || p.category === c) &&
      (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
    );

    list.innerHTML = items.map(p => `
      <article class="card">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p class="price">${formatPrice(p.price)}</p>

        <div class="actions">
          <a href="product.html?id=${p.id}" class="btn">View</a>
          <button class="btn add-js" data-id="${p.id}">Add</button>
        </div>
      </article>
    `).join('');

    attachAddButtons();
  }

  search?.addEventListener("input", filterAndRender);
  cat?.addEventListener("change", filterAndRender);

  filterAndRender();
}

/* Product Page */
function renderProductPage(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")) || 1;

  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;

  document.getElementById('productImage').src = p.image;
  document.getElementById('productTitle').textContent = p.title;
  document.getElementById('productPrice').textContent = formatPrice(p.price);
  document.getElementById('productDesc').textContent = p.desc;

  document.getElementById('addToCart')?.addEventListener('click', () => {
    const qty = Number(document.getElementById('qty')?.value || 1);
    addToCart(p.id, qty);
  });
}

/* Add to cart buttons */
function attachAddButtons(){
  document.querySelectorAll('.add-js').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id), 1));
  });
}

/* UI Initializer */
function initUI(){
  renderFeatured();
  renderProductList();
  renderProductPage();

  // Footer year
  document.querySelectorAll('[id^="year"]').forEach(
    span => span.textContent = new Date().getFullYear()
  );

  updateCartCountUI();
}

/* ============================
   SCROLL REVEAL ANIMATION
   ============================ */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // reveal only once
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}

window.addEventListener('DOMContentLoaded', initScrollReveal);


window.addEventListener('DOMContentLoaded', initUI);

/* Expose for debugging */
window.SHOPLY = { PRODUCTS };
