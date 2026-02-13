import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../../models/user.model.js";
import Seller from "../../models/sellerSingnup.model.js";
import CompanyDetails from "../../models/company.model.js";
import Product from "../../models/product.model.js";
import { IMAGE_MAP, getProductImages } from "../../data/imageMap.js"; // ← image URLs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 4 alag files padhte hai ────────────────────────────────────
const usersRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/user.json"), "utf-8")
);
const sellersRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/seller.json"), "utf-8")
);
const companiesRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/compnay.json"), "utf-8")
);
const productsRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/product.json"), "utf-8")
);

// ─── Helper: $oid → ObjectId ────────────────────────────────────
const toId = (val) => new mongoose.Types.ObjectId(val.$oid);
// ─── Helper: $date → Date ───────────────────────────────────────
const toDate = (val) => (val ? new Date(val.$date) : null);

// ─────────────────────────────────────────────────────────────────
// IMAGE REPLACE FUNCTION — seed se pehle chalenga
// ─────────────────────────────────────────────────────────────────
function replaceAllImages(users, companies, products) {
  console.log("🖼️  Replacing placeholder images with real Unsplash URLs...");

  // ── 1. USERS — profileURL aur signature replace ──
  users.forEach((user) => {
    const uid = user._id.$oid;

    // profile image
    if (IMAGE_MAP.userProfiles[uid]) {
      user.profileURL = {
        url: IMAGE_MAP.userProfiles[uid],
        publicId: `profiles/${user.name.toLowerCase().replace(" ", "_")}`,
      };
    }

    // signature
    if (IMAGE_MAP.signatures[uid]) {
      user.buyer_data.buyer_signature = {
        url: IMAGE_MAP.signatures[uid],
        publicId: `signatures/${user.name.toLowerCase().replace(" ", "_")}`,
      };
    }
  });
  console.log("  ✅ User profiles & signatures updated");

  // ── 2. COMPANIES — logo aur companyPhotos replace ──
  companies.forEach((company) => {
    const cid = company._id.$oid;

    // logo
    if (IMAGE_MAP.companyLogos[cid]) {
      company.companyIntro.logo = IMAGE_MAP.companyLogos[cid];
    }

    // company photos
    if (IMAGE_MAP.companyPhotos[cid]) {
      company.companyIntro.companyPhotos = IMAGE_MAP.companyPhotos[cid];
    }
  });
  console.log("  ✅ Company logos & photos updated");

  // ── 3. PRODUCTS — productImages replace (subCategory se sahi images milenge) ──
  products.forEach((product) => {
    const imgCount = product.productImages?.length || 3; // original kitni thi utni rakhein
    product.productImages = getProductImages(product, imgCount);
  });
  console.log("  ✅ Product images updated");

  console.log("🖼️  All images replaced successfully!");
}

// ─────────────────────────────────────────────────────────────────
// SEED DATABASE
// ─────────────────────────────────────────────────────────────────
export const seedDatabase = async (req, res) => {
  try {
    console.log("🌱 Starting database seeding...");

    // ── check karo existing data ──
    if (!req.skipCheck) {
      const existingUsers = await User.countDocuments();
      if (existingUsers > 0) {
        return res.status(400).json({
          success: false,
          message: "Database already has data. Use POST /force-seed-database",
        });
      }
    }

    // ── RAW JSON copy karein (mutate nahi karna original) ──
    const usersData = JSON.parse(JSON.stringify(usersRaw));
    const companiesData = JSON.parse(JSON.stringify(companiesRaw));
    const productsData = JSON.parse(JSON.stringify(productsRaw));

    // ── 🖼️ SEED SE PEHLE — sab images replace kar dein ──
    replaceAllImages(usersData, companiesData, productsData);

    // ── 1. USERS ──
    const users = usersData.map((u) => ({
      ...u,
      _id: toId(u._id),
      buyer_data: {
        ...u.buyer_data,
        billing_address: u.buyer_data.billing_address.map((addr) => ({
          ...addr,
          _id: toId(addr._id),
        })),
        shipping_address: u.buyer_data.shipping_address.map((addr) => ({
          ...addr,
          _id: toId(addr._id),
        })),
      },
      createdAt: toDate(u.createdAt),
      updatedAt: toDate(u.updatedAt),
      lastLogin: toDate(u.lastLogin),
    }));

    // ── 2. SELLERS ──
    const sellers = sellersRaw.map((s) => ({
      ...s,
      _id: toId(s._id),
      userId: toId(s.userId),
      createdAt: toDate(s.createdAt),
      updatedAt: toDate(s.updatedAt),
    }));

    // ── 3. COMPANIES ──
    const companies = companiesData.map((c) => ({
      ...c,
      _id: toId(c._id),
      sellerId: toId(c.sellerId),
      createdAt: toDate(c.createdAt),
      updatedAt: toDate(c.updatedAt),
    }));

    // ── 4. PRODUCTS ──
    // ── 4. PRODUCTS ──
    const products = productsData.map((p) => ({
      ...p,
      _id: toId(p._id),
      companyId: p.companyId ? toId(p.companyId) : null, // ✅ null handle karo
      sellerId: toId(p.sellerId),
      userId: p.userId ? toId(p.userId) : undefined,
      createdAt: toDate(p.createdAt),
      updatedAt: toDate(p.updatedAt),
      technical_file: p.technical_file
        ? {
            ...p.technical_file,
            upload_timestamp: toDate(p.technical_file.upload_timestamp),
            seller_validation_timestamp: toDate(
              p.technical_file.seller_validation_timestamp
            ),
          }
        : undefined,
    }));

    // ── Insert — order important hai ──
    console.log("🔄 Inserting data...");

    await User.insertMany(users, { ordered: true });
    console.log(`✅ Users: ${users.length}`);

    await Seller.insertMany(sellers, { ordered: true });
    console.log(`✅ Sellers: ${sellers.length}`);

    await CompanyDetails.insertMany(companies, { ordered: true });
    console.log(`✅ Companies: ${companies.length}`);

    await Product.insertMany(products, { ordered: true });
    console.log(`✅ Products: ${products.length}`);

    console.log("🎉 Seeding completed!");

    res.status(200).json({
      success: true,
      message: "Database seeded successfully",
      data: {
        users: users.length,
        sellers: sellers.length,
        companies: companies.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding database",
      error: error.message,
    });
  }
};
