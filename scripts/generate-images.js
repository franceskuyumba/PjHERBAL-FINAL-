// Generates elegant SVG placeholder images for products, categories and blog posts.
// Run with: npm run images
// Replace with real photography later by dropping files into /public/images.

const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
const imagesDir = path.join(publicDir, "images");

const palette = {
  "mens-health": { from: "#1f733d", to: "#0f3b22", accent: "#e7b13a" },
  "weight-management": { from: "#2f8f4e", to: "#0d2b18", accent: "#f3dd8d" },
  "energy-immunity": { from: "#b7741e", to: "#5a3a10", accent: "#f9efc8" },
  "womens-wellness": { from: "#8c6d3f", to: "#3c2610", accent: "#f3dd8d" },
  "brain-focus": { from: "#1f733d", to: "#0a1f14", accent: "#8ccd98" },
  "detox-digestion": { from: "#2f8f4e", to: "#0c2917", accent: "#ecc553" },
  blog: { from: "#1f733d", to: "#0d2b18", accent: "#e7b13a" },
};

function leafSvg(accent) {
  return `<g transform="translate(400 380) scale(1.6)">
    <path d="M0 -120 C 90 -90, 130 -20, 0 130 C -130 -20, -90 -90, 0 -120 Z" fill="rgba(255,255,255,0.12)" stroke="${accent}" stroke-width="2"/>
    <path d="M0 -100 C 30 -60, 40 0, 0 100" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
    <path d="M0 -60 C -25 -40, -30 0, -15 55" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <path d="M0 -40 C 25 -25, 32 10, 12 45" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
  </g>`;
}

function productSvg(slug, label, key) {
  const p = palette[key] || palette["energy-immunity"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/>
      <stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  <circle cx="150" cy="150" r="180" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <circle cx="660" cy="660" r="240" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <circle cx="680" cy="140" r="90" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <g fill="rgba(255,255,255,0.18)">
    <circle cx="120" cy="620" r="4"/><circle cx="200" cy="580" r="3"/>
    <circle cx="640" cy="420" r="3"/><circle cx="580" cy="680" r="4"/>
    <circle cx="90" cy="260" r="3"/><circle cx="720" cy="320" r="3"/>
  </g>
  ${leafSvg(p.accent)}
  <text x="400" y="690" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="rgba(255,255,255,0.92)">${label}</text>
  <text x="400" y="726" text-anchor="middle" font-family="Verdana, sans-serif" font-size="16" letter-spacing="4" fill="rgba(255,255,255,0.5)">PJHERBAL CLINIC</text>
</svg>`;
}

function categorySvg(name, key) {
  const p = palette[key] || palette["energy-immunity"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/>
      <stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="560" fill="url(#bg)"/>
  <circle cx="640" cy="120" r="200" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <circle cx="120" cy="470" r="140" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>
  ${leafSvg(p.accent)}
  <text x="400" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="rgba(255,255,255,0.95)">${name}</text>
</svg>`;
}

function blogSvg(title, key = "blog") {
  const p = palette[key];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/>
      <stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1050" cy="150" r="260" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <circle cx="150" cy="560" r="180" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <g transform="translate(600 320) scale(2.4)">${leafSvg(p.accent).replace(/<g transform="translate\(400 380\) scale\(1\.6\)">/, "").replace(/<\/g>$/, "")}</g>
  <text x="600" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="rgba(255,255,255,0.95)">${title}</text>
</svg>`;
}

function heroSvg() {
  const p = palette["energy-immunity"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f733d"/>
      <stop offset="100%" stop-color="#0c2917"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <rect width="900" height="900" fill="url(#glow)"/>
  <circle cx="140" cy="160" r="210" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
  <circle cx="770" cy="730" r="260" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>
  <circle cx="760" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <g transform="translate(450 430) scale(1.9)">${leafSvg(p.accent).replace(/<g transform="translate\(400 380\) scale\(1\.6\)">/, "").replace(/<\/g>$/, "")}</g>
  <text x="450" y="770" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="rgba(255,255,255,0.94)">Pure Wellness</text>
  <text x="450" y="814" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" letter-spacing="5" fill="rgba(255,255,255,0.5)">PJHERBAL CLINIC</text>
</svg>`;
}

function logo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 220 48">
  <g transform="translate(6 4)">
    <circle cx="20" cy="20" r="16" fill="#1f733d"/>
    <path d="M20 8 C 28 13, 30 20, 20 32 C 10 20, 12 13, 20 8 Z" fill="#f3dd8d"/>
    <path d="M20 12 C 25 17, 26 22, 20 28" fill="none" stroke="#1f733d" stroke-width="1.4"/>
  </g>
  <text x="46" y="22" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#113c24">PJHERBAL</text>
  <text x="46" y="36" font-family="Verdana, sans-serif" font-size="9" letter-spacing="3" fill="#b7741e">CLINIC · SEGEREA</text>
</svg>`;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1f733d"/>
  <path d="M32 12 C 44 18, 48 32, 32 52 C 16 32, 20 18, 32 12 Z" fill="#f3dd8d"/>
  <path d="M32 18 C 40 24, 42 32, 32 44" fill="none" stroke="#1f733d" stroke-width="2"/>
</svg>`;
}

function write(file, content) {
  const full = path.join(imagesDir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("  wrote", path.relative(publicDir, full));
}

console.log("Generating placeholder images...");

write("logo.svg", logo());
write("favicon.svg", favicon());
fs.writeFileSync(path.join(publicDir, "favicon.svg"), favicon());
write("hero.svg", heroSvg());

const products = {
  "male-vitality-plus": "Male Vitality",
  "vigor-max-capsules": "VigorMax",
  "prostacare": "ProstaCare",
  "slimherbal-tea": "SlimHerbal Tea",
  "fat-burn-max": "Fat Burn Max",
  "garcinia-cambogia": "Garcinia",
  "moringa-power": "Moringa Power",
  "black-seed-oil": "Black Seed Oil",
  "ginger-honey-tonic": "Ginger & Honey",
  "bee-propolis": "Bee Propolis",
  "womens-balance": "Women's Balance",
  "collagen-glow": "Collagen Glow",
  "femcare": "FemCare",
  "brain-booster": "Brain Booster",
  "focus-formula": "Focus Formula",
  "detox-cleanse": "Detox Cleanse",
  "digestease": "DigestEase",
  "aloe-detox-juice": "Aloe Detox",
};

const productKeys = {
  "male-vitality-plus": "mens-health",
  "vigor-max-capsules": "mens-health",
  "prostacare": "mens-health",
  "slimherbal-tea": "weight-management",
  "fat-burn-max": "weight-management",
  "garcinia-cambogia": "weight-management",
  "moringa-power": "energy-immunity",
  "black-seed-oil": "energy-immunity",
  "ginger-honey-tonic": "energy-immunity",
  "bee-propolis": "energy-immunity",
  "womens-balance": "womens-wellness",
  "collagen-glow": "womens-wellness",
  "femcare": "womens-wellness",
  "brain-booster": "brain-focus",
  "focus-formula": "brain-focus",
  "detox-cleanse": "detox-digestion",
  "digestease": "detox-digestion",
  "aloe-detox-juice": "detox-digestion",
};

for (const [slug, label] of Object.entries(products)) {
  write(`products/${slug}.svg`, productSvg(slug, label, productKeys[slug]));
}

const categories = {
  "mens-health": "Men's Health",
  "weight-management": "Weight Management",
  "energy-immunity": "Energy & Immunity",
  "womens-wellness": "Women's Wellness",
  "brain-focus": "Brain & Focus",
  "detox-digestion": "Detox & Digestion",
};
for (const [slug, name] of Object.entries(categories)) {
  write(`categories/${slug}.svg`, categorySvg(name, slug));
}

write("blog/immunity.svg", blogSvg("Immunity"));
write("blog/weight.svg", blogSvg("Weight Loss"));
write("blog/mens-health.svg", blogSvg("Men's Health"));
write("blog/detox.svg", blogSvg("Detox"));

console.log("Done.");
