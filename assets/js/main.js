// SOLVO Single-Product Vercel Storefront JS

// 1. Car Data for Fitment Selector
const carData = {
    'porsche': ['911 GT3 / Turbo', 'Taycan', 'Panamera', 'Cayenne / Macan', '718 Cayman'],
    'bmw': ['M3 / M4 (G80)', 'M5 (F90)', 'i4 / i7', 'X5 / X6 M', '3 / 4 / 5 Series'],
    'mercedes': ['AMG GT', 'C63 / E63 AMG', 'G-Wagon (W463A)', 'S-Class / E-Class', 'GLE / GLC'],
    'audi': ['RS6 Avant', 'RS7 Sportback', 'R8 V10', 'e-tron GT', 'A4 / A6 / Q7'],
    'tesla': ['Model S Plaid', 'Model 3 Performance', 'Model X', 'Model Y', 'Cybertruck'],
    'land-rover': ['Range Rover SV', 'Range Rover Sport', 'Defender 110/90', 'Velar'],
    'toyota': ['Supra GR', 'Land Cruiser 300', 'Camry / RAV4', '4Runner'],
    'ford': ['Mustang GT / Dark Horse', 'F-150 Raptor', 'Explorer', 'Mach-E']
};

function updateModels(make) {
    const modelSelect = document.getElementById('fitment-model');
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

function verifyFitment() {
    const make = document.getElementById('fitment-make').value;
    const model = document.getElementById('fitment-model').value;
    const year = document.getElementById('fitment-year').value;
    const resultBox = document.getElementById('fitment-result');

    if (!make) {
        alert('Please select your vehicle make first.');
        return;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>100% Guaranteed Fit:</strong> Certified SOLVO SeatGap Organizer is engineered to fit your <strong>' + (year ? year + ' ' : '') + make.toUpperCase() + (model ? ' ' + model : '') + '</strong>.';
}

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

    document.getElementById('summary-bundle-name').textContent = name;
    document.getElementById('summary-total-price').textContent = '$' + price.toFixed(2) + ' USD';
}

// 4. Order Form Submit
function handleOrderSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const address = document.getElementById('cust-address').value;
    const country = document.getElementById('cust-country').value;

    const btn = document.getElementById('btn-pay');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        alert('🎉 ORDER SIMULATION SUCCESSFUL!\n\nCustomer: ' + name + '\nEmail: ' + email + '\nPackage: ' + currentBundleName + '\nTotal: $' + currentBundlePrice.toFixed(2) + ' USD\nShipping to: ' + address + ', ' + country + '\n\n(When you link your live PayPal Merchant ID, the real payment window opens here!)');
        btn.innerHTML = '<i class="fa-brands fa-paypal"></i> PAY SECURELY WITH PAYPAL / CARD';
        btn.style.opacity = '1';
    }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
    initBeforeAfter();
});
