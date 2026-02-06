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

    // ✅ NEW USERS
    "507f1f77bcf86cd799439015":
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", // Vikram
    "507f1f77bcf86cd799439016":
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", // Meera
    "507f1f77bcf86cd799439017":
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", // Arjun
    "507f1f77bcf86cd799439018":
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80", // Kavya
    "507f1f77bcf86cd799439019":
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80", // Rohan
    "507f1f77bcf86cd799439020":
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", // Ananya
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

    // ✅ NEW COMPANIES
    "507f1f77bcf86cd799439205":
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80", // Udaipur Marble
    "507f1f77bcf86cd799439206":
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=200&q=80", // Pune Ceramic
    "507f1f77bcf86cd799439207":
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200&q=80", // Surat Stone
    "507f1f77bcf86cd799439208":
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80", // Bangalore Engineered
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

    // ✅ NEW COMPANIES
    "507f1f77bcf86cd799439205": [
      // Udaipur Marble Palace
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    ],
    "507f1f77bcf86cd799439206": [
      // Pune Ceramic Solutions
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    "507f1f77bcf86cd799439207": [
      // Surat Stone Industries
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    ],
    "507f1f77bcf86cd799439208": [
      // Bangalore Engineered Surfaces
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
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
    // ── TILES (vitrified, porcelain, wall, floor, mosaic, glazed) ──
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
    // ✅ METAL FINISHES (NEW)
    "metal finishes": [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
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

    // ✅ NEW SIGNATURES
    "507f1f77bcf86cd799439015":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439016":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439017":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439018":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439019":
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=80",
    "507f1f77bcf86cd799439020":
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
    "glazed tiles": "tiles", // ✅ ADDED
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
    "metal finishes": "metal finishes", // ✅ ADDED
  };

  const key = keyMap[sub] || "default";
  const allImages = IMAGE_MAP.products[key];

  // count kitne chahiye (e.g. 3 or 4) — slice kar do
  return allImages.slice(0, count);
}
