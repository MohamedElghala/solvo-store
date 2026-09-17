// SOLVO Single-Product & Flagship Storefront JS

// 1. Car Data for Fitment Selector
const carData = {
    'porsche': ['911 GT3 / Turbo', 'Taycan', 'Panamera', 'Cayenne / Macan', '718 Cayman'],
    'bmw': ['M3 / M4 (G80)', 'M5 (F90)', 'i4 / i7', 'X5 / X6 M', '3 / 4 / 5 Series'],
    'mercedes': ['AMG GT', 'C63 / E63 AMG', 'G-Wagon (W463A)', 'S-Class / E-Class', 'GLE / GLC'],
    'audi': ['RS6 Avant', 'RS7 Sportback', 'R8 V10', 'e-tron GT', 'A4 / A6 / Q7'],
    'tesla': ['Model S Plaid', 'Model 3 Performance', 'Model X', 'Model Y', 'Cybertruck'],
    'land-rover': ['Range Rover SV', 'Range Rover Sport', 'Defender 110/90', 'Velar'],
    'toyota': ['Supra GR', 'Land Cruiser 300', 'Camry / RAV4', '4Runner', 'Corolla'],
    'ford': ['Mustang GT / Dark Horse', 'F-150 Raptor', 'Explorer', 'Mach-E', 'Bronco'],
    'honda': ['Civic Type R', 'Accord', 'CR-V', 'HR-V', 'Pilot'],
    'chevrolet': ['Corvette', 'Camaro', 'Tahoe / Suburban', 'Equinox', 'Silverado'],
    'hyundai': ['Ioniq 5 / 6', 'Tucson', 'Santa Fe', 'Elantra N', 'Palisade'],
    'kia': ['EV6', 'K5', 'Telluride', 'Sportage', 'Stinger']
};

function solvoUpdateModels(make) {
    const modelSelect = document.getElementById('solvo-fitment-model') || document.getElementById('fitment-model');
    if (!modelSelect) return;
    modelSelect.innerHTML = '<option value="">[SELECT MODEL]</option>';
    if (carData[make]) {
        carData[make].forEach(model => {
            const opt = document.createElement('option');
            opt.value = model;
            opt.textContent = model;
            modelSelect.appendChild(opt);
        });
    }
}
function updateModels(make) { solvoUpdateModels(make); }

function solvoSubmitFitment(e) {
    if (e && e.preventDefault) e.preventDefault();
    const makeElem = document.getElementById('solvo-fitment-make') || document.getElementById('fitment-make');
    const modelElem = document.getElementById('solvo-fitment-model') || document.getElementById('fitment-model');
    const yearElem = document.getElementById('solvo-fitment-year') || document.getElementById('fitment-year');
    const resultBox = document.getElementById('solvo-fitment-result') || document.getElementById('fitment-result');

    const make = makeElem ? makeElem.value : '';
    const model = modelElem && modelElem.selectedIndex > 0 ? modelElem.options[modelElem.selectedIndex].text : '';
    const year = yearElem ? yearElem.value : '';

    if (!make) {
        if (makeElem) {
            makeElem.focus();
            makeElem.style.borderColor = '#DC2626';
            setTimeout(() => { makeElem.style.borderColor = ''; }, 1500);
        }
        return false;
    }

    if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#22C55E;margin-right:6px;"></i> <strong>100% Guaranteed Fitment:</strong> Certified SOLVO precision accessories are engineered for your <strong>' + (year ? year + ' ' : '') + make.toUpperCase() + (model ? ' ' + model : '') + '</strong>. Covered by our 30-day money-back guarantee.';
    }
    return false;
}
function verifyFitment() { solvoSubmitFitment(); }

// 2. Before & After Slider
function initBeforeAfter() {
    const stage = document.getElementById('ba-stage');
    const afterWrap = document.getElementById('ba-after-wrap');
    const handle = document.getElementById('ba-handle');
    if (!stage || !afterWrap || !handle) return;

    let isDragging = false;

    function setPosition(clientX) {
        const rect = stage.getBoundingClientRect();
        let pos = (clientX - rect.left) / rect.width;
        pos = Math.max(0.05, Math.min(0.95, pos));
        const percent = pos * 100;
        afterWrap.style.width = percent + '%';
        handle.style.left = percent + '%';
    }

    stage.addEventListener('mousedown', (e) => { isDragging = true; setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });

    stage.addEventListener('touchstart', (e) => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
}

// 3. Bundle Selection
let currentBundlePrice = 24.00;
let currentBundleName = '1x Driver Side Unit';

function selectBundle(bundleNum, price, name) {
    currentBundlePrice = price;
    currentBundleName = name;

    document.querySelectorAll('.bundle-card').forEach(card => {
        card.classList.remove('selected');
        const icon = card.querySelector('.bundle-radio i');
        if (icon) icon.className = 'fa-regular fa-circle';
    });

    const activeCard = document.getElementById('bundle-' + bundleNum);
    if (activeCard) {
        activeCard.classList.add('selected');
        const icon = activeCard.querySelector('.bundle-radio i');
        if (icon) icon.className = 'fa-solid fa-circle-dot';
    }

    const nameElem = document.getElementById('summary-bundle-name');
    if (nameElem) nameElem.textContent = name;
    
    const priceElem = document.getElementById('summary-total-price');
    if (priceElem) priceElem.textContent = '$' + price.toFixed(2) + ' USD';
}

// 4. Order Form Submit
function handleOrderSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-pay');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting to Secure Gateway...';
        btn.style.opacity = '0.8';
    }

    setTimeout(() => {
        alert('🎉 ORDER SIMULATION SUCCESSFUL!\n\nPackage: ' + currentBundleName + '\nTotal: $' + currentBundlePrice.toFixed(2) + ' USD\n\n(When your PayPal Client ID is linked, the secure PayPal popup opens here!)');
        if (btn) {
            btn.innerHTML = '<i class="fa-brands fa-paypal"></i> SECURE CHECKOUT WITH PAYPAL / CARD';
            btn.style.opacity = '1';
        }
    }, 1200);
}

// 5. Mobile Nav Toggle
function toggleFlagshipNav() {
    const nav = document.getElementById('flagship-mobile-nav') || document.getElementById('mobile-nav');
    if (nav) nav.classList.toggle('active');
}

// 6. FAQ Accordion (for faq.html)
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!wasActive) item.classList.add('active');
        });
    });
}

// 7. Contact Form (for contact.html)
function handleContactSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
    }
    setTimeout(() => {
        alert('Thank you for reaching out to SOLVO Support!\n\nYour message has been received. Our luxury concierge team will respond within 24 hours.');
        e.target.reset();
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE';
            btn.disabled = false;
        }
    }, 1000);
}

// 8. Catalog Filtering
function filterCatalog(category, btn) {
    document.querySelectorAll('.filter-tab').forEach(t => {
        t.style.background = '#101216';
        t.style.color = '#94A3B8';
        t.style.border = '1px solid rgba(255,255,255,0.1)';
        t.classList.remove('active');
    });
    if (btn) {
        btn.style.background = '#DC2626';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.classList.add('active');
    }
    const cards = document.querySelectorAll('#catalog-grid .product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-cat') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 9. Mobile Menu Aliases
function toggleMobileMenu() {
    toggleFlagshipNav();
}

// 10. Winning 10 Products Data & Quick-View Modal System
const productsData = {
    'seatgap': {
        id: 'seatgap',
        name: 'SOLVO SeatGap Organizer™',
        category: 'Cabin Organization',
        price: 24.00,
        oldPrice: 45.00,
        savePercent: '46%',
        rating: 4.8,
        reviews: '1,247',
        image: 'assets/img/seatgap_hero.jpg',
        description: 'Ends the seat-gap black hole once and for all. Engineered from aerospace dry carbon fiber and supple Nappa leather trim, featuring dual built-in retractable high-speed USB-C & Lightning charging cables. Universally compressible to fit 99% of vehicle gaps.',
        bullets: [
            'Built-in dual retractable fast-charging (USB-C + Lightning)',
            'Aerospace dry carbon fiber with supple Nappa leather trim',
            'High-density memory foam base firmly wedges into place',
            'Laser-measured fitment: stops keys, phones, and coins from falling',
            'Spill-proof, heat-resistant, and wipes clean instantly'
        ]
    },
    'dashcam': {
        id: 'dashcam',
        name: '4K Stealth AI Dash Cam',
        category: 'Cockpit Tech & Security',
        price: 119.00,
        oldPrice: 160.00,
        savePercent: '25%',
        rating: 4.9,
        reviews: '482',
        image: 'assets/img/dash_cam.jpg',
        description: 'Ultra-compact OEM-integrated 4K dash camera featuring a Sony Starvis 2 low-light sensor and active AI accident detection. Features 24/7 G-sensor parking surveillance with zero battery drain and instant smartphone WiFi video download.',
        bullets: [
            'Real 4K Ultra-HD recording with Sony Starvis 2 night vision',
            'Stealth rearview mirror integration — 100% obstruction free',
            '24/7 Intelligent parking surveillance with voltage cutoff protection',
            'High-speed 5GHz Wi-Fi and instant iOS / Android clip export',
            'G-Sensor emergency collision auto-lock memory buffer'
        ]
    },
    'carplay': {
        id: 'carplay',
        name: 'Wireless CarPlay & Android Auto 2-in-1 Adapter',
        category: 'Cockpit Tech & Wireless',
        price: 39.00,
        oldPrice: 65.00,
        savePercent: '40%',
        rating: 4.8,
        reviews: '891',
        image: 'assets/img/charging_dock.jpg',
        description: 'Converts factory wired Apple CarPlay and Android Auto into high-speed wireless connectivity in seconds. Powered by an automotive-grade 5.8GHz dual-core chipset for imperceptible audio delay and flawless GPS navigation.',
        bullets: [
            'Instant 5.8GHz WiFi & Bluetooth 5.3 auto-connect upon vehicle start',
            'True plug-and-play setup: zero apps or vehicle teardown required',
            'Retains 100% factory steering wheel controls, knobs, and touchscreen',
            'Compatible with both Apple CarPlay and Google Android Auto',
            'Ultra-compact aluminum heatsink prevents thermal throttling'
        ]
    },
    'vacuum': {
        id: 'vacuum',
        name: 'Cordless 120W Turbo Air Duster & Vacuum',
        category: 'Cabin Detailing',
        price: 34.00,
        oldPrice: 55.00,
        savePercent: '38%',
        rating: 4.7,
        reviews: '514',
        image: 'assets/img/car_vacuum.jpg',
        description: 'Dual-action high-velocity brushless motor that switches between a 120,000 RPM hurricane air duster and a 16,000 Pa suction vacuum. Cleans deep into AC vents, cupholders, seat seams, and trunk liners with clinical precision.',
        bullets: [
            '120,000 RPM high-speed turbine motor delivers 16,000 Pa suction',
            '2-in-1 blower duster and deep vacuum with multi-nozzle attachments',
            'Washable dual-layer HEPA filter captures 99.97% of micro-particles',
            'Fast USB-C rechargeable 6000mAh battery with 35-min runtime',
            'Lightweight, cordless design stores neatly in your glove box'
        ]
    },
    'cryo-mount': {
        id: 'cryo-mount',
        name: 'MagSafe 15W Cryo-Cooling Car Mount',
        category: 'Cockpit Tech & Power',
        price: 28.00,
        oldPrice: 48.00,
        savePercent: '42%',
        rating: 4.8,
        reviews: '672',
        image: 'assets/img/cryo_mount.jpg',
        description: 'Advanced magnetic phone mount equipped with active Peltier semiconductor refrigeration and ultra-silent cooling fan. Keeps your iPhone or Android at icy temperatures while fast charging at 15W during heavy GPS and sun exposure.',
        bullets: [
            'Peltier semiconductor cooling prevents summer thermal battery drain',
            'Military-grade N52 neodymium magnets hold through aggressive potholes',
            'Certified 15W fast wireless charging with smart voltage regulation',
            '360-degree aluminum ball-joint for portrait and landscape viewing',
            'Laser-grip vent clamp fits both horizontal and vertical louvers'
        ]
    },
    'ceramic': {
        id: 'ceramic',
        name: '9H Nano-Diamond Ceramic Coating Suite',
        category: 'Detail & Paint Protection',
        price: 45.00,
        oldPrice: 75.00,
        savePercent: '40%',
        rating: 4.9,
        reviews: '389',
        image: 'assets/img/ceramic_coating.jpg',
        description: 'Professional grade 9H liquid crystal nano-ceramic coating engineered for deep mirror gloss and impenetrable hydrophobic protection. Seals clear coat against acid rain, UV oxidation, brake dust, and light micro-scratches for up to 12 months.',
        bullets: [
            'Genuine 9H diamond hardness surface protection',
            'Super-hydrophobic lotus-leaf water and mud repelling barrier',
            'Anti-UV and anti-oxidation matrix prevents paint fading',
            'Includes ceramic applicator block, micro-suede cloths, and prep spray',
            'Safe on automotive paint, glass, wheels, and carbon fiber trim'
        ]
    },
    'inflator': {
        id: 'inflator',
        name: '150 PSI Digital Smart Tire Inflator',
        category: 'Highway Emergency',
        price: 42.00,
        oldPrice: 68.00,
        savePercent: '38%',
        rating: 4.9,
        reviews: '442',
        image: 'assets/img/emergency_inflator.jpg',
        description: 'Compact cordless heavy-duty air compressor that fills a standard car tire from 28 to 35 PSI in just 60 seconds. Features a precision digital LCD gauge, 4 preset vehicle modes, automatic pressure shutoff, and emergency SOS strobe lighting.',
        bullets: [
            '150 PSI maximum pressure with heavy-duty metal cylinder block',
            'Digital LCD real-time gauge with ±0.5 PSI medical precision',
            'Auto-shutoff feature prevents dangerous over-inflation',
            'Built-in emergency LED flashlight with white and red SOS strobe',
            'USB output function doubles as an emergency power bank for phones'
        ]
    },
    'console-tray': {
        id: 'console-tray',
        name: 'Precision Center Console Vault',
        category: 'Cabin Organization',
        price: 22.00,
        oldPrice: 38.00,
        savePercent: '42%',
        rating: 4.8,
        reviews: '618',
        image: 'assets/img/console_tray.jpg',
        description: 'Double-tier precision-molded console organizer that eliminates armrest clutter. Features dedicated compartments for keys, cards, sunglasses, and coins with acoustic silicone noise-dampening liners.',
        bullets: [
            'Precision laser OEM measurement fits center console flawlessly',
            'Non-slip textured silicone liners stop rattling on bumpy roads',
            'Dual-tier smart layout doubles usable armrest storage volume',
            'Integrated coin organizer and quick-grab sunglasses cradle',
            'High-temperature ABS construction withstands extreme cabin heat'
        ]
    },
    'trunk-vault': {
        id: 'trunk-vault',
        name: 'Aerospace Carbon Cargo Vault Trunk Organizer',
        category: 'Cabin & Cargo Control',
        price: 49.00,
        oldPrice: 85.00,
        savePercent: '42%',
        rating: 4.8,
        reviews: '743',
        image: 'assets/img/trunk_organizer.jpg',
        description: 'Heavy-duty 1680D ballistic waterproof oxford organizer with reinforced carbon-look composite sidewalls. Features removable velcro dividers, non-slip bottom rubber grippers, and tie-down security straps to lock luggage and gear.',
        bullets: [
            '1680D Ballistic waterproof oxford fabric with carbon grain panels',
            'Reinforced composite sidewalls hold rigid shape even when empty',
            'Modular layout with adjustable sub-dividers and mesh side pockets',
            'Rubberized non-skid cleats prevent sliding during spirited cornering',
            'Collapses down to 2 inches flat for effortless under-floor storage'
        ]
    },
    'detailing-kit': {
        id: 'detailing-kit',
        name: 'Pro Interior Detailing & Restoration Suite',
        category: 'Cabin Detailing',
        price: 29.00,
        oldPrice: 49.00,
        savePercent: '41%',
        rating: 4.8,
        reviews: '452',
        image: 'assets/img/car_care_kit.jpg',
        description: 'Professional grade interior detailing suite featuring ultra-soft boar hair vent brushes, 1200 GSM micro-suede polishing cloths, and anti-static leather conditioning balm. Restores OEM matte finish without greasy residue.',
        bullets: [
            'Scratch-free natural boar hair brushes for delicate AC vents and screens',
            '1200 GSM edgeless microfiber buffing and restoration towels',
            'pH-neutral safe formula for Nappa leather, Alcantara, and carbon trim',
            'Anti-static barrier repels cabin dust and pet hair for up to 60 days',
            'Includes heavy-duty zip travel case for trunk storage'
        ]
    }
};

let currentModalProductId = null;

function openProductModal(productId) {
    const p = productsData[productId];
    if (!p) return;
    currentModalProductId = productId;
    
    const modal = document.getElementById('solvo-product-modal');
    if (!modal) return;
    
    const imgElem = document.getElementById('modal-img');
    if (imgElem) {
        imgElem.src = p.image;
        imgElem.alt = p.name;
    }
    
    const catElem = document.getElementById('modal-cat');
    if (catElem) catElem.textContent = p.category;
    
    const titleElem = document.getElementById('modal-title');
    if (titleElem) titleElem.textContent = p.name;
    
    const priceElem = document.getElementById('modal-price');
    if (priceElem) priceElem.textContent = '$' + p.price.toFixed(2);
    
    const oldPriceElem = document.getElementById('modal-old-price');
    if (oldPriceElem) oldPriceElem.textContent = '$' + p.oldPrice.toFixed(2);
    
    const badgeElem = document.getElementById('modal-badge');
    if (badgeElem) badgeElem.textContent = 'SAVE ' + p.savePercent;
    
    const reviewsElem = document.getElementById('modal-reviews');
    if (reviewsElem) reviewsElem.textContent = '(' + p.reviews + ' verified reviews)';
    
    const descElem = document.getElementById('modal-desc');
    if (descElem) descElem.textContent = p.description;
    
    const bulletsUl = document.getElementById('modal-bullets');
    if (bulletsUl) {
        bulletsUl.innerHTML = '';
        p.bullets.forEach(b => {
            const li = document.createElement('li');
            li.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + b;
            bulletsUl.appendChild(li);
        });
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('solvo-product-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function handleModalBuy() {
    if (!currentModalProductId) return;
    const p = productsData[currentModalProductId];
    if (p.id === 'seatgap') {
        closeProductModal();
        const el = document.getElementById('solvo-flagship');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('🎉 ORDER ADDED!\n\nProduct: ' + p.name + '\nPrice: $' + p.price.toFixed(2) + ' USD\n\nFast Express Shipping & 30-Day Money Back Guarantee included.');
        closeProductModal();
    }
}

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initBeforeAfter();
    initFAQ();
});

