/**
 * SOLVO Luxury E-Commerce Side Cart Drawer & State Engine
 * Inspired by SuperDesign Luxury Commerce Patterns
 */

(function () {
    'use strict';

    const CART_STORAGE_KEY = 'solvo_cart_v2';
    const FREE_SHIPPING_THRESHOLD = 35.00;

    // Cart State
    let cart = {
        items: [] // { id, name, price, oldPrice, image, qty }
    };

    function loadCart() {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                cart = JSON.parse(saved);
                if (!Array.isArray(cart.items)) cart.items = [];
            }
        } catch (e) {
            console.error('Failed to load cart from localStorage:', e);
            cart = { items: [] };
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to save cart:', e);
        }
        updateBadge();
        renderDrawer();
    }

    function getSubtotal() {
        return cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    function getTotalCount() {
        return cart.items.reduce((count, item) => count + item.qty, 0);
    }

    function updateBadge() {
        const count = getTotalCount();
        document.querySelectorAll('.cart-badge').forEach(b => {
            b.textContent = count;
            b.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    // Initialize Drawer HTML into DOM if not present
    function injectDrawerHTML() {
        if (document.getElementById('solvo-side-cart-drawer')) return;

        const drawer = document.createElement('div');
        drawer.id = 'solvo-side-cart-drawer';
        drawer.className = 'solvo-cart-drawer';
        drawer.innerHTML = `
            <div class="solvo-cart-backdrop" onclick="solvoCart.close()"></div>
            <div class="solvo-cart-panel" role="dialog" aria-label="Shopping Cart">
                <!-- Header -->
                <div class="solvo-cart-header">
                    <div class="solvo-cart-title-wrap">
                        <i class="fa-solid fa-bag-shopping" style="color:#DC2626;"></i>
                        <h3 class="solvo-cart-title">YOUR CART (<span id="solvo-cart-count-title">0</span>)</h3>
                    </div>
                    <button type="button" class="solvo-cart-close-btn" onclick="solvoCart.close()" aria-label="Close cart">&times;</button>
                </div>

                <!-- Free Shipping Progress Bar -->
                <div class="solvo-cart-shipping-banner" id="solvo-cart-shipping-banner">
                    <div class="solvo-shipping-info" id="solvo-shipping-info">
                        <i class="fa-solid fa-truck-fast"></i> <span>Add items to qualify for Free Shipping</span>
                    </div>
                    <div class="solvo-shipping-bar-track">
                        <div class="solvo-shipping-bar-fill" id="solvo-shipping-bar-fill" style="width: 0%;"></div>
                    </div>
                </div>

                <!-- Items Container -->
                <div class="solvo-cart-items" id="solvo-cart-items-list">
                    <!-- Dynamic Items Rendered Here -->
                </div>

                <!-- Footer / Checkout Area -->
                <div class="solvo-cart-footer" id="solvo-cart-footer">
                    <div class="solvo-cart-summary">
                        <div class="solvo-cart-summary-row">
                            <span>Subtotal</span>
                            <span class="solvo-cart-subtotal-val" id="solvo-cart-subtotal-val">$0.00</span>
                        </div>
                        <div class="solvo-cart-summary-row" style="color:#94A3B8; font-size:0.85rem;">
                            <span>Global Express Shipping</span>
                            <span id="solvo-cart-shipping-val">Calculated at checkout</span>
                        </div>
                    </div>

                    <button type="button" class="solvo-cart-checkout-btn" onclick="solvoCart.checkout()">
                        <i class="fa-brands fa-paypal"></i> EXPRESS CHECKOUT &bull; <span id="solvo-cart-btn-total">$0.00</span>
                    </button>

                    <div class="solvo-cart-trust-icons">
                        <span><i class="fa-solid fa-lock"></i> 256-Bit SSL Encrypted</span>
                        <span>&bull;</span>
                        <span><i class="fa-solid fa-shield-halved"></i> 30-Day Guarantee</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);
    }

    function renderDrawer() {
        const listContainer = document.getElementById('solvo-cart-items-list');
        const countTitle = document.getElementById('solvo-cart-count-title');
        const subtotalElem = document.getElementById('solvo-cart-subtotal-val');
        const btnTotal = document.getElementById('solvo-cart-btn-total');
        const footer = document.getElementById('solvo-cart-footer');
        const shippingInfo = document.getElementById('solvo-shipping-info');
        const shippingBar = document.getElementById('solvo-shipping-bar-fill');

        if (!listContainer) return;

        const subtotal = getSubtotal();
        const totalCount = getTotalCount();
        if (countTitle) countTitle.textContent = totalCount;
        if (subtotalElem) subtotalElem.textContent = '$' + subtotal.toFixed(2) + ' USD';
        if (btnTotal) btnTotal.textContent = '$' + subtotal.toFixed(2) + ' USD';

        // Free Shipping calculation
        if (subtotal >= FREE_SHIPPING_THRESHOLD) {
            if (shippingInfo) {
                shippingInfo.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#22C55E;"></i> <strong style="color:#22C55E;">CONGRATULATIONS!</strong> You unlocked FREE Worldwide Shipping!';
            }
            if (shippingBar) {
                shippingBar.style.width = '100%';
                shippingBar.style.backgroundColor = '#22C55E';
            }
        } else {
            const away = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
            const percent = Math.min(100, Math.max(5, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));
            if (shippingInfo) {
                shippingInfo.innerHTML = `<i class="fa-solid fa-plane-up" style="color:#DC2626;"></i> Add <strong style="color:#fff;">$${away}</strong> more for <strong>FREE Express Shipping</strong>`;
            }
            if (shippingBar) {
                shippingBar.style.width = percent + '%';
                shippingBar.style.backgroundColor = '#DC2626';
            }
        }

        if (cart.items.length === 0) {
            listContainer.innerHTML = `
                <div class="solvo-cart-empty">
                    <i class="fa-solid fa-cart-shopping solvo-cart-empty-icon"></i>
                    <h4>Your Cart is Empty</h4>
                    <p>Upgrade your high-performance drive with bespoke SOLVO precision accessories.</p>
                    <a href="index.html#catalog-grid" onclick="solvoCart.close()" class="solvo-btn-metallic" style="display:inline-block;padding:0.75rem 1.5rem;font-size:0.85rem;text-decoration:none;">EXPLORE THE CATALOG</a>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }

        if (footer) footer.style.display = 'block';

        listContainer.innerHTML = cart.items.map((item, index) => `
            <div class="solvo-cart-item">
                <div class="solvo-cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="solvo-cart-item-body">
                    <div class="solvo-cart-item-title-row">
                        <a href="product.html?id=${item.id}" class="solvo-cart-item-title">${item.name}</a>
                        <button type="button" class="solvo-cart-item-remove" onclick="solvoCart.removeItem(${index})" title="Remove item">&times;</button>
                    </div>
                    <div class="solvo-cart-item-price">
                        <span>$${item.price.toFixed(2)}</span>
                        ${item.oldPrice ? `<del>$${item.oldPrice.toFixed(2)}</del>` : ''}
                    </div>
                    <div class="solvo-cart-item-actions">
                        <div class="solvo-cart-qty-picker">
                            <button type="button" onclick="solvoCart.updateQty(${index}, -1)" aria-label="Decrease quantity">-</button>
                            <span>${item.qty}</span>
                            <button type="button" onclick="solvoCart.updateQty(${index}, 1)" aria-label="Increase quantity">+</button>
                        </div>
                        <span class="solvo-cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Public API
    window.solvoCart = {
        init: function () {
            loadCart();
            injectDrawerHTML();
            updateBadge();
            renderDrawer();
        },
        open: function () {
            injectDrawerHTML();
            renderDrawer();
            const drawer = document.getElementById('solvo-side-cart-drawer');
            if (drawer) {
                drawer.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        close: function () {
            const drawer = document.getElementById('solvo-side-cart-drawer');
            if (drawer) {
                drawer.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        addItem: function (prodId, qty = 1) {
            let prod = null;
            if (window.solvoProductsMaster && window.solvoProductsMaster[prodId]) {
                prod = window.solvoProductsMaster[prodId];
            } else if (window.productsData && window.productsData[prodId]) {
                prod = window.productsData[prodId];
            }

            if (!prod) {
                // Fallback default
                prod = {
                    id: prodId,
                    name: 'SOLVO Precision Accessory',
                    price: 24.00,
                    oldPrice: 45.00,
                    images: ['assets/img/seatgap_hero.jpg']
                };
            }

            const existingIndex = cart.items.findIndex(it => it.id === prod.id);
            const image = (prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image || 'assets/img/seatgap_hero.jpg');

            if (existingIndex > -1) {
                cart.items[existingIndex].qty += qty;
            } else {
                cart.items.push({
                    id: prod.id,
                    name: prod.name,
                    price: Number(prod.price) || 24.00,
                    oldPrice: Number(prod.oldPrice) || 45.00,
                    image: image,
                    qty: qty
                });
            }

            saveCart();
            this.open();
        },
        updateQty: function (index, delta) {
            if (!cart.items[index]) return;
            cart.items[index].qty += delta;
            if (cart.items[index].qty <= 0) {
                cart.items.splice(index, 1);
            }
            saveCart();
        },
        removeItem: function (index) {
            if (!cart.items[index]) return;
            cart.items.splice(index, 1);
            saveCart();
        },
        checkout: function () {
            if (cart.items.length === 0) return;
            const subtotal = getSubtotal().toFixed(2);
            const summary = cart.items.map(it => `${it.qty}x ${it.name}`).join(', ');
            
            // Visual feedback
            const btn = document.querySelector('.solvo-cart-checkout-btn');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting to Secure Gateway...';
                btn.style.opacity = '0.85';
            }

            setTimeout(() => {
                const randOrder = 'SLV-' + Math.floor(10000 + Math.random() * 90000);
                // Clear cart after checkout
                cart = { items: [] };
                saveCart();
                window.location.href = `thank-you.html?order=${randOrder}&total=${subtotal}`;
            }, 1000);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        window.solvoCart.init();
    });

})();
