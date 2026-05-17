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
let cartCount = 0;
let wishlist  = new Set();

// ── Render Products ──
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = products.map(p => {
    const savings = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
    const stars   = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
    const badge   = p.badge === 'new'  ? '<span class="badge-tag badge-new">New</span>'
                  : p.badge === 'sale' ? '<span class="badge-tag badge-sale">Sale</span>'
                  : '';
    return `
      <div class="product-card fade-up" id="card-${p.id}">
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

// ── Add to Cart ──
function addToCart(id, btn) {
  cartCount++;
  document.getElementById('cartCount').textContent = cartCount;
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  showToast(`"${products.find(p => p.id === id).name}" added to cart!`);
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
  }, 2000);
}

function openCart() {
  showToast(`${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`);
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
renderProducts();

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
