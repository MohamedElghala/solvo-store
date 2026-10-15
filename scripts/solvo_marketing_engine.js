/**
 * SOLVO Autonomous Growth & Performance Advertising Engine
 * Generates viral 60-second video scripts, Google Veo 3 / Flow prompts, Meta/TikTok ad copy, and SEO broadcasts.
 */

const fs = require('fs');
const path = require('path');

const CAMPAIGNS = [
  {
    id: 'campaign-seatgap-organizer',
    productName: 'SOLVO SeatGap Organizer™ (Carbon Edition)',
    price: '$24.00',
    oldPrice: '$45.00',
    category: 'Cabin Organization & Fast Charging',
    targetAudience: 'Tesla, BMW, Mercedes, Audi, Ford, Porsche owners (US/UK/Canada/Australia)',
    url: 'https://solvo-store.vercel.app/product.html?id=seatgap',
    hookText: 'The black hole between your car seat just cost you your phone and keys for the last time.',
    videoScript: {
      hook_0_5s: 'STOP dropping your phone between your car seats! 🛑📱 [Visual: Phone slipping between seats in slow motion, driver groaning in frustration]',
      problem_5_20s: 'That gap is an absolute black hole. Coins, fries, credit cards, AirPods — once they fall down there, you have to pull over and scrape your knuckles trying to reach them while driving.',
      solution_20_45s: 'Meet the SOLVO SeatGap Organizer™. Precision CAD-scanned to fit 99% of luxury car seats with aerospace dry carbon fiber and supple Nappa leather trim. Plus, it has dual built-in retractable 27W USB-C and Lightning cables that tuck away invisibly.',
      cta_45_60s: 'Order yours today for only $24 at solvo-store.vercel.app with Free Express Shipping on 2-packs and a 30-day money-back guarantee. Link in bio!'
    },
    veoPrompts: {
      scene1_hook: 'Cinematic close-up 9:16 vertical video. An expensive smartphone slips out of a driver hand and slides deep into the narrow crevice between a luxury car leather seat and the center console. Cinematic moody interior lighting, shallow depth of field, slow motion 60fps.',
      scene2_solution: 'Smooth camera dolly-in. A hand effortlessly slides the SOLVO carbon fiber organizer with red accent stitching into the car seat gap. It fits like a glove with zero gaps. The built-in retractable braided USB-C cable pulls out smoothly and clicks into the phone, LED charging indicator lights up.',
      scene3_lifestyle: 'Wide interior cinematic shot of a sleek sports car cockpit at golden hour sunset. Both driver and passenger seats have the sleek SOLVO organizer installed. Center console is clean, organized, zero loose cables. 4k resolution, hyper-realistic, photorealistic.'
    },
    metaAds: {
      headline: 'Never Lose Your Phone Between Car Seats Again 🚗⚡',
      primaryText: 'The crevice black hole is officially closed. The SOLVO SeatGap Organizer™ combines aerospace dry carbon fiber with dual retractable 27W fast-charging cables. Laser-fit for 99% of vehicles.\n\n🔥 Over 1,247 verified 5-star reviews.\n📦 Free Worldwide Express Shipping on $35+.\n🛡️ 30-Day Risk-Free Money-Back Guarantee.\n\nTap Shop Now to upgrade your cockpit today.',
      cta: 'Shop Now'
    },
    tiktokHashtags: '#caraccessories #cargadgets #cartok #solvo #carorganization #musthave #interiorcar'
  },
  {
    id: 'campaign-4k-dashcam',
    productName: '4K Stealth AI Dash Cam (Sony Starvis 2)',
    price: '$119.00',
    oldPrice: '$160.00',
    category: 'Vehicle Security & Optics',
    targetAudience: 'Daily commuters, luxury car owners, rideshare drivers, performance enthusiasts',
    url: 'https://solvo-store.vercel.app/product.html?id=dashcam',
    hookText: 'Hit and run drivers hate this tiny OEM-stealth gadget.',
    videoScript: {
      hook_0_5s: 'If your dash cam has messy hanging wires and blurry night video, throw it away. 🚨',
      problem_5_20s: 'When an accident happens at night or someone dings your door in a parking lot, regular dash cams give you grainy, useless footage where you can not even read the license plate.',
      solution_20_45s: 'The SOLVO 4K Stealth AI Dash Cam uses the new Sony Starvis 2 sensor with true 4K HDR night vision. It clips directly behind your rearview mirror with zero messy cables and has a 24/7 G-sensor parking guard that starts recording the instant your vehicle is touched.',
      cta_45_60s: 'Protect your vehicle investment before your next commute. Get yours now at solvo-store.vercel.app with free global shipping!'
    },
    veoPrompts: {
      scene1_hook: 'Cinematic night driving shot through rain-slicked windshield. Headlights illuminate the road. Camera pushes into the sleek rearview mirror where a stealth black cylindrical dash cam sits seamlessly integrated with no visible wires.',
      scene2_tech: '3D animated cutaway of the Sony Starvis 2 optical sensor inside the camera body. Light photons hit the multi-layer glass lens, revealing ultra-sharp 4K video resolution showing a crystal-clear license plate at night.',
      scene3_parking: 'Exterior night shot of a luxury sedan parked on a city street. A passing car gently nudges the bumper. The SOLVO dash cam red indicator pulses once, automatically locking and backing up the incident video.'
    },
    metaAds: {
      headline: 'Crystal-Clear 4K Night Vision. Zero Wires. 24/7 Guard.',
      primaryText: 'Insurance claims are won with hard evidence. The SOLVO 4K Stealth Dash Cam features Sony Starvis 2 optics, AI license plate recognition, and 24/7 parking surveillance in a covert OEM factory-finish design.\n\n✅ 4K Ultra HD @ 60 FPS\n✅ Sony Starvis 2 Night Vision\n✅ 24/7 G-Sensor Impact Guard\n✅ Instant Wi-Fi Phone Playback\n\nOrder today with 30-Day Money-Back Guarantee.',
      cta: 'Learn More'
    },
    tiktokHashtags: '#dashcam #carrash #carsecurity #cargadget #safedriving #cartok #solvo'
  },
  {
    id: 'campaign-cryo-mount',
    productName: 'MagSafe 15W Cryo-Cooling Cockpit Mount',
    price: '$28.00',
    oldPrice: '$48.00',
    category: 'Cockpit Technology',
    targetAudience: 'iPhone & Android users navigating with Apple Maps, Waze, Google Maps',
    url: 'https://solvo-store.vercel.app/product.html?id=cryo-mount',
    hookText: 'Why does your phone always overheat and dim its screen right when you need GPS the most?',
    videoScript: {
      hook_0_5s: 'Is your phone burning hot every time you use GPS in your car? 🔥📱',
      problem_5_20s: 'Wireless charging plus summer heat and GPS navigation causes your phone to throttle, dim the screen to 20%, and permanently destroy your battery health.',
      solution_20_45s: 'The SOLVO Cryo-Cooling Cockpit Mount features an aerospace semiconductor Peltier cooling plate and silent turbofan that drops your phone temperature by 18°C while delivering ultra-fast 15W MagSafe wireless charging. Plus N52 magnets hold it steady even over speed bumps.',
      cta_45_60s: 'Keep your phone icy cold and at 100% battery. Visit solvo-store.vercel.app to grab yours today!'
    },
    veoPrompts: {
      scene1_thermal: 'Thermal imaging camera view of a smartphone on a car dashboard glowing fiery red (45°C). Then camera cuts to the phone snapping onto the SOLVO Cryo Mount with a frosty blue LED ambient ring.',
      scene2_frost: 'Extreme macro shot of frost condensation forming on the aluminum semiconductor cooling plate of the mount. Silent RGB fan spins smoothly, dropping temperature to ice cold.',
      scene3_action: 'Car drives fast over cobblestones and speed bumps. The phone stays rock-solid on the magnetic mount with zero vibration or wobble.'
    },
    metaAds: {
      headline: 'Active Cryo-Cooling Drops Phone Temps by 18°C ❄️⚡',
      primaryText: 'No more dimmed screens. No more battery throttling. The SOLVO Cryo-Mount combines a high-speed Peltier cooling chip with 15W MagSafe charging and military-grade N52 neodymium magnets.\n\n🧊 Semiconductor Active Chill\n⚡ 15W Fast Wireless Charging\n🔒 Anti-Shake Vent Lock\n\nUpgrade your cockpit now with Free Express Shipping over $35.',
      cta: 'Shop Now'
    },
    tiktokHashtags: '#magsafe #carmount #phonereview #techgadgets #caraccessories #solvo'
  }
];

function generateMarkdownDispatch(campaigns) {
  const timestamp = new Date().toISOString();
  let md = `# 🚀 SOLVO Performance Advertising & Marketing Dispatch\n`;
  md += `**Generated:** ${timestamp}\n`;
  md += `**Storefront Production:** [https://solvo-store.vercel.app/](https://solvo-store.vercel.app/)\n`;
  md += `**Custom Domain:** [https://solvo.store/](https://solvo.store/)\n\n`;
  md += `---\n\n`;

  campaigns.forEach((c, idx) => {
    md += `## 🏆 Campaign ${idx + 1}: ${c.productName} (${c.price})\n`;
    md += `- **Category:** ${c.category}\n`;
    md += `- **Target Audience:** ${c.targetAudience}\n`;
    md += `- **Landing URL:** [${c.url}](${c.url})\n`;
    md += `- **Core Hook:** *"${c.hookText}"*\n\n`;

    md += `### 🎬 60-Second Viral Video Script (TikTok / Reels / Shorts)\n`;
    md += `- **[0-5s Hook]:** ${c.videoScript.hook_0_5s}\n`;
    md += `- **[5-20s Problem]:** ${c.videoScript.problem_5_20s}\n`;
    md += `- **[20-45s Solution]:** ${c.videoScript.solution_20_45s}\n`;
    md += `- **[45-60s CTA]:** ${c.videoScript.cta_45_60s}\n\n`;

    md += `### 🎥 Google Veo 3 / Flow / Kling Cinematic Prompts\n`;
    md += `\`\`\`text\n[Scene 1 - Visual Hook]:\n${c.veoPrompts.scene1_hook || c.veoPrompts.scene1_thermal}\n\n[Scene 2 - Product Core]:\n${c.veoPrompts.scene2_solution || c.veoPrompts.scene2_tech || c.veoPrompts.scene2_frost}\n\n[Scene 3 - Luxury Lifestyle]:\n${c.veoPrompts.scene3_lifestyle || c.veoPrompts.scene3_parking || c.veoPrompts.scene3_action}\n\`\`\`\n\n`;

    md += `### 📱 Meta / TikTok Paid Ad Copy\n`;
    md += `- **Headline:** ${c.metaAds.headline}\n`;
    md += `- **Primary Text:**\n${c.metaAds.primaryText}\n`;
    md += `- **Call To Action:** [${c.metaAds.cta}]\n`;
    md += `- **Hashtags:** \`${c.tiktokHashtags}\`\n\n`;
    md += `---\n\n`;
  });

  md += `## 📈 Monetization & Conversion Funnel Strategy\n`;
  md += `1. **Viral Video Organic Traffic:** Post 1-2 video clips daily across TikTok, YouTube Shorts, and Instagram Reels using the generated 60-second scripts.\n`;
  md += `2. **Interactive 3D Fitment Retargeting:** Direct traffic to the interactive 3D WebGL simulator (\`https://solvo-store.vercel.app/#solvo-hotspots\`) to maximize dwell time and engagement.\n`;
  md += `3. **Free Shipping Tier Upsell:** Dynamic cart progress bar incentivizes customers to add a second accessory to cross the $35.00 free shipping line.\n`;
  md += `4. **Google Search Console & GA4 Tracking:** Every view, cart addition, and checkout is logged to \`window.dataLayer\` and Google Analytics (G-WWN1MNE93T) for conversion attribution and Google Ads remarketing.\n`;

  return md;
}

function run() {
  console.log('🚀 Running SOLVO Autonomous Marketing & Advertising Engine...');
  const mdContent = generateMarkdownDispatch(CAMPAIGNS);
  const dispatchPath = path.join(__dirname, '..', 'SOLVO_MARKETING_DISPATCH.md');
  fs.writeFileSync(dispatchPath, mdContent, 'utf8');
  console.log(`✔ Generated Advertising Dispatch: ${dispatchPath}`);

  const dataDir = path.join(__dirname, '..', 'assets', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const jsonPath = path.join(dataDir, 'marketing_campaigns.json');
  fs.writeFileSync(jsonPath, JSON.stringify(CAMPAIGNS, null, 2), 'utf8');
  console.log(`✔ Generated Public JSON campaigns: ${jsonPath}`);
  console.log('✨ SOLVO Marketing Engine completed successfully!');
}

run();
