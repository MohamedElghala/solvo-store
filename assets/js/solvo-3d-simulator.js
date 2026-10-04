/**
 * SOLVO Virtual Vehicle Simulator™ — Interactive 3D WebGL Vehicle Fitment & Try-On Studio
 * Powered by Three.js & OrbitControls
 * SuperDesign Luxury Automotive Experience
 */

(function () {
    'use strict';

    let scene, camera, renderer, controls;
    let carGroup, productMarkers = {};
    let activeProduct = null;
    let isFullscreen = false;
    let ambientLightColor = 0xDC2626;
    let interiorLight, spotlight;
    let animationFrameId;

    // Camera target positions for smooth interpolation
    let targetCameraPos = { x: 4.5, y: 2.2, z: 4.5 };
    let targetLookAt = { x: 0, y: 0.5, z: 0 };
    let isTransitioning = false;

    // Active fitment accessory details
    const FITMENT_DATA = {
        'seatgap': {
            id: 'seatgap',
            title: 'SOLVO SeatGap Organizer™ (Carbon Edition)',
            category: 'Center Console & Cabin',
            price: 24.00,
            oldPrice: 45.00,
            image: 'assets/img/seatgap_hero.jpg',
            fitment: 'Universal (Adaptive Memory Foam Base Fits 99% of Vehicles)',
            benefit: 'Ends the crevice drop black hole & provides dual retractable 27W USB-C & Lightning power.',
            camPos: { x: 0.8, y: 1.4, z: 0.2 },
            lookAt: { x: 0.1, y: 0.7, z: 0.1 },
            highlightPart: 'seatgap'
        },
        'dashcam': {
            id: 'dashcam',
            title: '4K Stealth AI Dash Cam (Sony Starvis 2)',
            category: 'Windshield & Rearview Mirror',
            price: 119.00,
            oldPrice: 160.00,
            image: 'assets/img/dash_cam.jpg',
            fitment: 'OEM Stealth Mirror Mount (Zero Cable Clutter)',
            benefit: 'Sony Starvis 2 4K night vision optics with 24/7 G-sensor parking guard.',
            camPos: { x: 0.4, y: 1.6, z: 0.9 },
            lookAt: { x: 0.0, y: 1.3, z: 0.5 },
            highlightPart: 'dashcam'
        },
        'cryo-mount': {
            id: 'cryo-mount',
            title: 'MagSafe 15W Cryo-Cooling Cockpit Mount',
            category: 'Air Vent & Dashboard Cockpit',
            price: 28.00,
            oldPrice: 48.00,
            image: 'assets/img/cryo_mount.jpg',
            fitment: 'CNC Aluminum Anti-Shake Clamp (Fits All Vent Slats)',
            benefit: 'Active semiconductor cooling fan prevents phone overheating during navigation.',
            camPos: { x: -0.6, y: 1.5, z: 0.7 },
            lookAt: { x: -0.1, y: 1.0, z: 0.3 },
            highlightPart: 'cryomount'
        },
        'trunk-vault': {
            id: 'trunk-vault',
            title: 'Aerospace Carbon Cargo Vault Organizer',
            category: 'Rear Trunk Compartment',
            price: 49.00,
            oldPrice: 85.00,
            image: 'assets/img/trunk_organizer.jpg',
            fitment: 'Laser-Fit Trunk Footprint (Non-Slip Heavy Duty Base)',
            benefit: 'Multi-compartment modular storage prevents items sliding during high-G cornering.',
            camPos: { x: 0.0, y: 2.2, z: -3.4 },
            lookAt: { x: 0.0, y: 0.8, z: -1.8 },
            highlightPart: 'trunk'
        },
        'ceramic': {
            id: 'ceramic',
            title: '9H Nano-Diamond Ceramic Coating Suite',
            category: 'Exterior Paintwork & Aero Panels',
            price: 45.00,
            oldPrice: 75.00,
            image: 'assets/img/ceramic_coating.jpg',
            fitment: 'All High-Performance Clearcoats (Self-Healing Hydrophobic)',
            benefit: 'Shields clearcoat with 9H diamond hardness and deep wet mirror reflection.',
            camPos: { x: 2.8, y: 1.2, z: 2.2 },
            lookAt: { x: 0.0, y: 0.6, z: 0.8 },
            highlightPart: 'ceramic'
        },
        'inflator': {
            id: 'inflator',
            title: '150 PSI Digital Smart Tire Inflator Compressor',
            category: 'Performance Wheel & Roadside Kit',
            price: 42.00,
            oldPrice: 68.00,
            image: 'assets/img/emergency_inflator.jpg',
            fitment: 'Universal High-Pressure Cordless Air Valve Interface',
            benefit: 'Rapid inflation to exact PSI with automated safety shutoff and LED torch.',
            camPos: { x: -2.4, y: 0.7, z: 1.6 },
            lookAt: { x: -1.4, y: 0.4, z: 1.4 },
            highlightPart: 'inflator'
        }
    };

    function init() {
        const container = document.getElementById('solvo-3d-canvas-container');
        if (!container) return;

        // Ensure Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded yet. Retrying in 200ms...');
            setTimeout(init, 200);
            return;
        }

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 560;

        // 1. Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x060709);
        scene.fog = new THREE.FogExp2(0x060709, 0.08);

        // 2. Camera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(targetCameraPos.x, targetCameraPos.y, targetCameraPos.z);

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clear container and append canvas
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // 4. OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxDistance = 9;
            controls.minDistance = 1.2;
            controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't go below floor
            controls.target.set(0, 0.5, 0);
        }

        // 5. Lighting Setup (Luxury Automotive Studio)
        setupStudioLighting();

        // 6. Showroom Floor & Telemetry Rings
        buildShowroomFloor();

        // 7. High-Performance Sports Vehicle 3D Model
        buildSportsVehicle();

        // 8. 3D Product Interactive Node Pins
        buildProductPins();

        // 9. Resize Handling
        window.addEventListener('resize', onWindowResize);

        // 10. Start Animation Loop
        animate();

        // 11. Bind UI Control Buttons
        bindUIControls();
    }

    function setupStudioLighting() {
        // Soft ambient fill
        const ambient = new THREE.AmbientLight(0x1F2937, 1.2);
        scene.add(ambient);

        // Studio Main Key Light (Warm clean white from front-top)
        const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
        keyLight.position.set(4, 6, 4);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);

        // SOLVO Signature Red Rim Light (From rear-top for aggressive sports presence)
        const redRimLight = new THREE.DirectionalLight(0xDC2626, 2.5);
        redRimLight.position.set(-4, 4, -4);
        scene.add(redRimLight);

        // Front Fill Light (Cool steel tone)
        const frontFill = new THREE.DirectionalLight(0x94A3B8, 1.0);
        frontFill.position.set(0, 3, 5);
        scene.add(frontFill);

        // Dynamic Spotlight for focused product inspection
        spotlight = new THREE.SpotLight(0xFFFFFF, 0, 10, Math.PI / 6, 0.3, 1);
        spotlight.position.set(0, 4, 0);
        scene.add(spotlight);

        // Cabin Ambient LED Light (Customizable color)
        interiorLight = new THREE.PointLight(ambientLightColor, 1.5, 3.5);
        interiorLight.position.set(0, 1.0, 0.2);
        scene.add(interiorLight);
    }

    function buildShowroomFloor() {
        // Reflective dark floor
        const floorGeo = new THREE.PlaneGeometry(30, 30);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x08090C,
            roughness: 0.3,
            metalness: 0.8
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.01;
        floor.receiveShadow = true;
        scene.add(floor);

        // Circular Neon Telemetry Rings
        const ringGeo1 = new THREE.RingGeometry(3.6, 3.65, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xDC2626, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = -Math.PI / 2;
        ring1.position.y = 0.005;
        scene.add(ring1);

        const ringGeo2 = new THREE.RingGeometry(4.8, 4.82, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x64748B, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.x = -Math.PI / 2;
        ring2.position.y = 0.005;
        scene.add(ring2);

        // Subtle Grid Helper
        const grid = new THREE.GridHelper(24, 24, 0xDC2626, 0x1E222B);
        grid.position.y = 0.002;
        scene.add(grid);
    }

    function buildSportsVehicle() {
        carGroup = new THREE.Group();

        // --- Materials ---
        const carPaintMat = new THREE.MeshStandardMaterial({
            color: 0x0F1115, // Deep Obsidian Metallic
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 1.5
        });

        const carbonFiberMat = new THREE.MeshStandardMaterial({
            color: 0x181A20,
            metalness: 0.7,
            roughness: 0.4
        });

        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x0A0D14,
            metalness: 0.95,
            roughness: 0.05,
            transparent: true,
            opacity: 0.75
        });

        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xE2E8F0,
            metalness: 0.98,
            roughness: 0.1
        });

        const redAccentMat = new THREE.MeshBasicMaterial({ color: 0xDC2626 });
        const headLightMat = new THREE.MeshBasicMaterial({ color: 0xE0F2FE });
        const rubberMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.85, metalness: 0.1 });

        // 1. Main Chassis (Lower Sleek Body)
        const bodyGeo = new THREE.BoxGeometry(2.1, 0.45, 4.6);
        const body = new THREE.Mesh(bodyGeo, carPaintMat);
        body.position.y = 0.48;
        body.castShadow = true;
        body.receiveShadow = true;
        carGroup.add(body);

        // 2. Front Hood Slope
        const hoodGeo = new THREE.BoxGeometry(2.0, 0.22, 1.4);
        const hood = new THREE.Mesh(hoodGeo, carPaintMat);
        hood.position.set(0, 0.58, 1.5);
        hood.rotation.x = 0.08;
        hood.castShadow = true;
        carGroup.add(hood);

        // Front Aero Splitter (Carbon Fiber)
        const splitterGeo = new THREE.BoxGeometry(2.15, 0.06, 0.4);
        const splitter = new THREE.Mesh(splitterGeo, carbonFiberMat);
        splitter.position.set(0, 0.22, 2.3);
        carGroup.add(splitter);

        // 3. Cockpit Canopy / Glass Greenhouse
        const cabinGeo = new THREE.BoxGeometry(1.65, 0.55, 2.1);
        const cabin = new THREE.Mesh(cabinGeo, glassMat);
        cabin.position.set(0, 0.95, -0.15);
        cabin.castShadow = true;
        carGroup.add(cabin);

        // Roof Panel (Carbon Fiber Lightweight Roof)
        const roofGeo = new THREE.BoxGeometry(1.58, 0.05, 1.8);
        const roof = new THREE.Mesh(roofGeo, carbonFiberMat);
        roof.position.set(0, 1.25, -0.2);
        carGroup.add(roof);

        // 4. Rear Trunk Deck & Spoiler
        const trunkGeo = new THREE.BoxGeometry(1.95, 0.35, 1.2);
        const trunk = new THREE.Mesh(trunkGeo, carPaintMat);
        trunk.position.set(0, 0.56, -1.65);
        trunk.castShadow = true;
        carGroup.add(trunk);

        // Ducktail Carbon Spoiler
        const spoilerGeo = new THREE.BoxGeometry(1.85, 0.06, 0.25);
        const spoiler = new THREE.Mesh(spoilerGeo, carbonFiberMat);
        spoiler.position.set(0, 0.78, -2.25);
        carGroup.add(spoiler);

        // Rear Diffuser & Red Lightbar
        const tailLightGeo = new THREE.BoxGeometry(1.9, 0.06, 0.05);
        const tailLight = new THREE.Mesh(tailLightGeo, redAccentMat);
        tailLight.position.set(0, 0.65, -2.31);
        carGroup.add(tailLight);

        // Front Matrix LED Headlights
        const leftHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.05), headLightMat);
        leftHeadlight.position.set(-0.75, 0.55, 2.31);
        carGroup.add(leftHeadlight);

        const rightHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.05), headLightMat);
        rightHeadlight.position.set(0.75, 0.55, 2.31);
        carGroup.add(rightHeadlight);

        // 5. Interior Details Visible through glass
        // Steering wheel
        const wheelRimGeo = new THREE.TorusGeometry(0.18, 0.025, 8, 24);
        const steeringWheel = new THREE.Mesh(wheelRimGeo, carbonFiberMat);
        steeringWheel.position.set(-0.4, 0.92, 0.45);
        steeringWheel.rotation.x = 0.4;
        carGroup.add(steeringWheel);

        // Center Console Bridge (Where SeatGap Organizer fits!)
        const consoleGeo = new THREE.BoxGeometry(0.3, 0.28, 1.2);
        const consoleMesh = new THREE.Mesh(consoleGeo, carbonFiberMat);
        consoleMesh.position.set(0, 0.65, 0.0);
        carGroup.add(consoleMesh);

        // Dashboard Display Screen
        const dashScreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.05), chromeMat);
        dashScreen.position.set(0, 0.88, 0.55);
        carGroup.add(dashScreen);

        // 6. Wheels (4 Performance Wheels)
        const wheelPositions = [
            { x: -1.05, y: 0.35, z: 1.4 },  // Front Left
            { x: 1.05, y: 0.35, z: 1.4 },   // Front Right
            { x: -1.05, y: 0.35, z: -1.4 }, // Rear Left
            { x: 1.05, y: 0.35, z: -1.4 }   // Rear Right
        ];

        wheelPositions.forEach((pos, idx) => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(pos.x, pos.y, pos.z);

            // Tire
            const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.26, 24);
            const tire = new THREE.Mesh(tireGeo, rubberMat);
            tire.rotation.z = Math.PI / 2;
            tire.castShadow = true;
            wheelGroup.add(tire);

            // Rim / Spokes (Titanium Chrome)
            const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.27, 16);
            const rim = new THREE.Mesh(rimGeo, chromeMat);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);

            // Red Brake Caliper
            const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.1);
            const caliper = new THREE.Mesh(caliperGeo, redAccentMat);
            caliper.position.set(pos.x > 0 ? -0.05 : 0.05, 0.12, 0);
            wheelGroup.add(caliper);

            carGroup.add(wheelGroup);
        });

        scene.add(carGroup);
    }

    function buildProductPins() {
        // Floating 3D Telemetry Pins for each accessory
        const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xDC2626 });
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6, wireframe: true });

        const pinLocations = {
            'seatgap': { x: 0.18, y: 0.78, z: 0.05, name: 'SeatGap Organizer' },
            'dashcam': { x: 0.0, y: 1.25, z: 0.65, name: '4K Dash Cam' },
            'cryo-mount': { x: -0.25, y: 0.95, z: 0.45, name: 'Cryo Mount' },
            'trunk-vault': { x: 0.0, y: 0.75, z: -1.75, name: 'Cargo Trunk' },
            'ceramic': { x: 0.0, y: 0.72, z: 1.5, name: '9H Ceramic Shield' },
            'inflator': { x: -1.2, y: 0.45, z: 1.4, name: 'Smart Inflator' }
        };

        Object.keys(pinLocations).forEach(key => {
            const loc = pinLocations[key];
            const pinGroup = new THREE.Group();
            pinGroup.position.set(loc.x, loc.y, loc.z);

            // Core sphere
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), pinMaterial);
            pinGroup.add(sphere);

            // Pulsing halo ring
            const halo = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 24), ringMaterial);
            halo.rotation.x = Math.PI / 2;
            pinGroup.add(halo);

            pinGroup.userData = { prodId: key };
            scene.add(pinGroup);
            productMarkers[key] = pinGroup;
        });
    }

    function onWindowResize() {
        const container = document.getElementById('solvo-3d-canvas-container');
        if (!container || !renderer || !camera) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Update controls
        if (controls) controls.update();

        // Pulsing animation for product markers
        const time = Date.now() * 0.003;
        Object.keys(productMarkers).forEach(k => {
            const pin = productMarkers[k];
            if (pin) {
                const scale = 1 + Math.sin(time * 2) * 0.15;
                pin.children[1].scale.set(scale, scale, scale);
                pin.children[1].rotation.z += 0.02;
            }
        });

        // Smooth Camera Transition (Gliding Camera)
        if (isTransitioning) {
            camera.position.x += (targetCameraPos.x - camera.position.x) * 0.06;
            camera.position.y += (targetCameraPos.y - camera.position.y) * 0.06;
            camera.position.z += (targetCameraPos.z - camera.position.z) * 0.06;

            if (controls) {
                controls.target.x += (targetLookAt.x - controls.target.x) * 0.06;
                controls.target.y += (targetLookAt.y - controls.target.y) * 0.06;
                controls.target.z += (targetLookAt.z - controls.target.z) * 0.06;
            }

            const dist = Math.hypot(
                targetCameraPos.x - camera.position.x,
                targetCameraPos.y - camera.position.y,
                targetCameraPos.z - camera.position.z
            );
            if (dist < 0.05) {
                isTransitioning = false;
            }
        }

        renderer.render(scene, camera);
    }

    // Camera preset transition function
    function glideToCamera(camPos, lookAt) {
        targetCameraPos = camPos;
        targetLookAt = lookAt || { x: 0, y: 0.5, z: 0 };
        isTransitioning = true;
    }

    // Try-on & Inspect Product function
    function tryOnProduct(prodId) {
        const data = FITMENT_DATA[prodId];
        if (!data) return;

        activeProduct = data;

        // Move camera to product position
        glideToCamera(data.camPos, data.lookAt);

        // Aim dynamic spotlight on the product
        if (spotlight) {
            spotlight.position.set(data.camPos.x * 1.2, data.camPos.y + 1.2, data.camPos.z * 1.2);
            spotlight.target.position.set(data.lookAt.x, data.lookAt.y, data.lookAt.z);
            spotlight.intensity = 2.5;
        }

        // Highlight selected pin
        Object.keys(productMarkers).forEach(k => {
            const p = productMarkers[k];
            if (p) {
                p.children[0].material.color.setHex(k === prodId ? 0x22C55E : 0xDC2626);
            }
        });

        // Update HUD Widget in DOM
        renderHUDWidget(data);
    }

    function renderHUDWidget(data) {
        const hud = document.getElementById('solvo-3d-hud-card');
        if (!hud) return;

        hud.style.display = 'block';
        hud.classList.add('active');

        hud.innerHTML = `
            <div class="solvo-hud-header">
                <span class="solvo-hud-badge"><i class="fa-solid fa-microchip"></i> ACTIVE VEHICLE FITMENT</span>
                <button type="button" class="solvo-hud-close" onclick="solvo3D.resetView()">&times;</button>
            </div>
            <div class="solvo-hud-content">
                <div class="solvo-hud-media">
                    <img src="${data.image}" alt="${data.title}">
                </div>
                <div class="solvo-hud-meta">
                    <span class="solvo-hud-cat">${data.category}</span>
                    <h4 class="solvo-hud-title">${data.title}</h4>
                    <p class="solvo-hud-benefit">${data.benefit}</p>
                    <div class="solvo-hud-fitment-tag">
                        <i class="fa-solid fa-circle-check" style="color:#22C55E;"></i> ${data.fitment}
                    </div>
                    <div class="solvo-hud-price-row">
                        <div class="solvo-hud-price">
                            <span>$${data.price.toFixed(2)}</span>
                            <del>$${data.oldPrice.toFixed(2)}</del>
                        </div>
                        <div class="solvo-hud-actions">
                            <button type="button" class="solvo-hud-add-btn" onclick="solvoCart.addItem('${data.id}', 1)">
                                <i class="fa-solid fa-plus"></i> ADD TO VEHICLE
                            </button>
                            <a href="product.html?id=${data.id}" class="solvo-hud-details-btn">FULL SPECS &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function resetView() {
        activeProduct = null;
        glideToCamera({ x: 4.5, y: 2.2, z: 4.5 }, { x: 0, y: 0.5, z: 0 });
        if (spotlight) spotlight.intensity = 0;

        // Reset pin colors
        Object.keys(productMarkers).forEach(k => {
            if (productMarkers[k]) {
                productMarkers[k].children[0].material.color.setHex(0xDC2626);
            }
        });

        const hud = document.getElementById('solvo-3d-hud-card');
        if (hud) hud.style.display = 'none';
    }

    function changeAmbientColor(hex) {
        ambientLightColor = hex;
        if (interiorLight) interiorLight.color.setHex(hex);
    }

    function toggleFullscreen() {
        const stage = document.getElementById('solvo-3d-stage-wrapper');
        if (!stage) return;

        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            stage.classList.add('fullscreen-active');
            document.body.style.overflow = 'hidden';
        } else {
            stage.classList.remove('fullscreen-active');
            document.body.style.overflow = '';
        }
        setTimeout(onWindowResize, 100);
    }

    function bindUIControls() {
        // Preset camera view buttons
        document.querySelectorAll('[data-cam-view]').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('[data-cam-view]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.getAttribute('data-cam-view');
                if (view === 'exterior') glideToCamera({ x: 4.5, y: 2.0, z: 4.5 }, { x: 0, y: 0.5, z: 0 });
                else if (view === 'cockpit') glideToCamera({ x: 0.0, y: 1.3, z: 0.3 }, { x: 0.0, y: 0.9, z: 0.8 });
                else if (view === 'console') tryOnProduct('seatgap');
                else if (view === 'windshield') tryOnProduct('dashcam');
                else if (view === 'trunk') tryOnProduct('trunk-vault');
                else if (view === 'wheels') tryOnProduct('inflator');
            });
        });

        // Ambient lighting color pills
        document.querySelectorAll('[data-light-color]').forEach(pill => {
            pill.addEventListener('click', function () {
                document.querySelectorAll('[data-light-color]').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const col = parseInt(pill.getAttribute('data-light-color'), 16);
                changeAmbientColor(col);
            });
        });

        // Try-on shelf items
        document.querySelectorAll('[data-try-product]').forEach(item => {
            item.addEventListener('click', function () {
                const prodId = item.getAttribute('data-try-product');
                tryOnProduct(prodId);
            });
        });
    }

    // Public API for external integration
    window.solvo3D = {
        init: init,
        tryOn: tryOnProduct,
        resetView: resetView,
        glideTo: glideToCamera,
        setAmbient: changeAmbientColor,
        toggleFullscreen: toggleFullscreen
    };

    document.addEventListener('DOMContentLoaded', function () {
        init();
    });

})();
