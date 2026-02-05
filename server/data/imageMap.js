// ─── imageMap.js ───────────────────────────────────────────────────
// Sab real Unsplash URLs hai yahan — koi API key nahi chahiye
// Har category ka apna set hai. Seed controller inhe use karega.
// ────────────────────────────────────────────────────────────────────

export const IMAGE_MAP = {
  // ════════════════════════════════════════════════════════════════
  // USER PROFILES
  // ════════════════════════════════════════════════════════════════
  userProfiles: {
    "507f1f77bcf86cd799439011":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", // Rajesh
    "507f1f77bcf86cd799439012":
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", // Priya
    "507f1f77bcf86cd799439013":
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80", // Amit
    "507f1f77bcf86cd799439014":
      "https://images.unsplash.com/photo-1494711657091-a3c16ba38e7e?w=200&q=80", // Sneha
  },

  // ════════════════════════════════════════════════════════════════
  // COMPANY LOGOS (simple clean look)
  // ════════════════════════════════════════════════════════════════
  companyLogos: {
    "507f1f77bcf86cd799439201":
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80", // Rajasthan Stone
    "507f1f77bcf86cd799439202":
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=80", // Ceramic World
    "507f1f77bcf86cd799439203":
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80", // Gujarat Granite
    "507f1f77bcf86cd799439204":
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&q=80", // Marble Art
  },

  // ════════════════════════════════════════════════════════════════
  // COMPANY PHOTOS (factory / showroom vibes)
  // ════════════════════════════════════════════════════════════════
  companyPhotos: {
    "507f1f77bcf86cd799439201": [
      // Rajasthan Stone Exports — stone factory
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    "507f1f77bcf86cd799439202": [
      // Ceramic World India — tiles showroom
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    "507f1f77bcf86cd799439203": [
      // Gujarat Granite Hub — granite processing
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    "507f1f77bcf86cd799439204": [
      // Marble Art Studio — studio / workshop
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // PRODUCTS — category wise real images
  // ════════════════════════════════════════════════════════════════
  products: {
    // ── MARBLE ──
    marble: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    // ── GRANITE ──
    granite: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    // ── SANDSTONE ──
    sandstone: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    // ── LIMESTONE ──
    limestone: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    // ── SLATE ──
    slate: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    // ── TILES (vitrified, porcelain, wall, floor, mosaic) ──
    tiles: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    // ── QUARTZITE ──
    quartzite: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    // ── QUARTZ / ENGINEERED ──
    quartz: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    ],
    // ── TRAVERTINE ──
    travertine: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    // ── TERRAZZO ──
    terrazzo: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    // ── CONCRETE ──
    concrete: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    // ── RESIN ──
    resin: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    ],
    // ── DEFAULT (fallback) ──
    default: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // SIGNATURES (simple clean look)
  // ════════════════════════════════════════════════════════════════
  signatures: {
    "507f1f77bcf86cd799439011":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439012":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439013":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439014":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
  },
};

// ─── Helper: product ka subCategory dekh ke sahi images return kare ──
export function getProductImages(product, count = 3) {
  const sub = (product.subCategory?.[0] || "").toLowerCase();

  // subCategory → imageMap key mapping
  const keyMap = {
    marble: "marble",
    granite: "granite",
    sandstone: "sandstone",
    limestone: "limestone",
    slate: "slate",
    "vitrified tiles": "tiles",
    "porcelain tiles": "tiles",
    "wall tiles": "tiles",
    "floor tiles": "tiles",
    "mosaic tiles": "tiles",
    quartzite: "quartzite",
    quartz: "quartz",
    "engineered stone": "quartz",
    travertine: "travertine",
    terrazzo: "terrazzo",
    concrete: "concrete",
    resin: "resin",
  };

  const key = keyMap[sub] || "default";
  const allImages = IMAGE_MAP.products[key];

  // count kitne chahiye (e.g. 3 or 4) — slice kar do
  return allImages.slice(0, count);
}
