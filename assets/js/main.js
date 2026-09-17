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
        const form = e.target;
        const box = form.parentElement;
        box.innerHTML = '<div style="text-align:center;padding:2rem;">' +
            '<i class="fa-solid fa-circle-check" style="font-size:2.5rem;color:#22C55E;margin-bottom:1rem;display:block;"></i>' +
            '<h3 style="margin-bottom:0.5rem;color:#fff;">Message Sent Successfully!</h3>' +
            '<p style="color:#94A3B8;">Our support team will respond to your email within 24 hours.</p>' +
            '</div>';
    }, 1000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initBeforeAfter();
    initFAQ();
});
