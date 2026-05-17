// ── Product Data ──
const products = [
  {
    id: 1,
    name: "Bloom Linen Blouse",
    price: 68,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    stars: 5,
    badge: "new",
    category: "Tops"
  },
  {
    id: 2,
    name: "Lavender Wrap Dress",
    price: 112,
    oldPrice: 148,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",
    stars: 5,
    badge: "sale",
    category: "Dresses"
  },
  {
    id: 3,
    name: "Garden Midi Skirt",
    price: 84,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
    stars: 4,
    badge: "new",
    category: "Bottoms"
  },
  {
    id: 4,
    name: "Sunset Silk Cami",
    price: 56,
    oldPrice: 72,
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600",
    stars: 5,
    badge: "sale",
    category: "Tops"
  },
  {
    id: 5,
    name: "Pearl Crossbody Bag",
    price: 138,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600",
    stars: 5,
    badge: null,
    category: "Accessories"
  },
  {
    id: 6,
    name: "Rosé Floral Sundress",
    price: 96,
    oldPrice: 125,
    image: "https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600",
    stars: 5,
    badge: "sale",
    category: "Dresses"
  }
];

// ── State ──
let cartItems    = [];          // { product, qty }
let wishlist     = new Set();
let activeFilter = 'All';
let searchQuery  = '';

// ── Render Products ──
function renderProducts(list, animate) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = `
      <div class="no-products">
        <div class="no-products-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try a different search term or category.</p>
      </div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const savings   = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
    const stars     = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
    const badge     = p.badge === 'new'  ? '<span class="badge-tag badge-new">New</span>'
                    : p.badge === 'sale' ? '<span class="badge-tag badge-sale">Sale</span>'
                    : '';
    const animClass = animate ? ' fade-up' : '';
    return `
      <div class="product-card${animClass}" id="card-${p.id}">
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}" class="product-img-bg" style="object-fit:cover;" />
          <div class="product-badges">${badge}</div>
          <button
            class="wishlist-btn ${wishlist.has(p.id) ? 'active' : ''}"
            onclick="toggleWishlist(${p.id}, this)"
            aria-label="Add to wishlist"
          >
            <svg width="16" height="16" fill="${wishlist.has(p.id) ? 'var(--rose)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <div>
              <div class="product-name">${p.name}</div>
              <div class="product-stars">${stars}</div>
            </div>
          </div>
          <div class="product-price-row">
            <span class="price-current">$${p.price}</span>
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
            ${savings    ? `<span class="price-save">-${savings}%</span>` : ''}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id}, this)">
            Add to Cart
          </button>
        </div>
      </div>`;
  }).join('');
}

// ── Filter & Search ──
function filterAndRender() {
  const q = searchQuery.trim().toLowerCase();
  const filtered = products.filter(p => {
    const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
    const matchesSearch   = p.name.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
  renderProducts(filtered, false);
}

// ── Cart: open / close ──
function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.body.style.overflow =
    document.getElementById('cartOverlay').classList.contains('open') ? 'hidden' : '';
}
function closeCart(e) {
  if (e.target === document.getElementById('cartOverlay')) toggleCart();
}
// keep the navbar cart icon working
function openCart() { toggleCart(); }

// ── Cart: render ──
function renderCart() {
  const totalQty   = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);

  // badge
  const badge = document.getElementById('cartCount');
  badge.textContent = totalQty;
  badge.style.display = totalQty ? 'flex' : 'none';

  // header count chip
  const chip = document.getElementById('cartHeaderCount');
  chip.textContent = totalQty ? `${totalQty} item${totalQty !== 1 ? 's' : ''}` : '';

  // total
  document.getElementById('cartTotal').textContent = `$${totalPrice.toFixed(2)}`;

  // items
  const el = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!cartItems.length) {
    footer.style.display = 'none';
    el.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <h3>Your cart is empty</h3>
        <p>Add some pieces you love<br>and they'll appear here.</p>
      </div>`;
    return;
  }

  footer.style.display = '';
  el.innerHTML = cartItems.map(({ product: p, qty }) => `
    <div class="cart-item" id="cart-item-${p.id}">
      <img src="${p.image}" alt="${p.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">$${p.price}</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${qty}</span>
          <button class="qty-btn" onclick="changeQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <span class="cart-item-subtotal">$${(p.price * qty).toFixed(2)}</span>
      </div>
    </div>`).join('');
}

// ── Cart: add ──
function addToCart(id, btn) {
  const product = products.find(p => p.id === id);
  const existing = cartItems.find(i => i.product.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ product, qty: 1 });
  }
  renderCart();
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  showToast(`"${product.name}" added to cart!`);
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
  }, 2000);
}

// ── Cart: quantity controls ──
function changeQty(id, delta) {
  const idx = cartItems.findIndex(i => i.product.id === id);
  if (idx === -1) return;
  cartItems[idx].qty += delta;
  if (cartItems[idx].qty <= 0) cartItems.splice(idx, 1);
  renderCart();
}

// ── Wishlist ──
function toggleWishlist(id, btn) {
  const svg = btn.querySelector('svg');
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.classList.remove('active');
    svg.setAttribute('fill', 'none');
    showToast('Removed from wishlist');
  } else {
    wishlist.add(id);
    btn.classList.add('active');
    svg.setAttribute('fill', 'var(--rose)');
    showToast('Added to wishlist ♡');
  }
}

// ── Toast ──
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Newsletter ──
function subscribeNewsletter(e) {
  e.preventDefault();
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('successMsg');
  form.style.display = 'none';
  success.classList.add('show');
}

// ── Navbar scroll shadow ──
const navbar    = document.getElementById('navbar');
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
});

// ── Init ──
renderProducts(products, true);
renderCart();

// ── Search & Filter event listeners ──
document.getElementById('productSearch').addEventListener('input', e => {
  searchQuery = e.target.value;
  filterAndRender();
});

document.getElementById('filterBtns').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  filterAndRender();
});

// ── Scroll Animations (Intersection Observer) ──
function observeFadeUps() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el) => {
    const siblings = el.parentElement.querySelectorAll('.fade-up');
    if (siblings.length > 1) {
      const idx = Array.from(siblings).indexOf(el);
      el.dataset.delay = idx * 120;
    }
    observer.observe(el);
  });
}
observeFadeUps();

// ── Mobile Nav ──
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
  document.body.style.overflow =
    document.getElementById('mobileNav').classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav(e) {
  if (e.target === document.getElementById('mobileNav')) toggleMobileNav();
}
